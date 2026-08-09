import { Prisma } from '@prisma/client';
import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db/client';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';
import { AuditService } from '../audit/audit.service';
import crypto from 'crypto';
import { authenticator } from 'otplib';
import { z } from 'zod';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

const ActiveTokenSchema = z.object({
  jti: z.string(),
  exp: z.number(),
});

const UserMetadataSchema = z
  .object({
    totpSecret: z.string().optional(),
    activeTokens: z.array(ActiveTokenSchema).optional(),
  })
  .catchall(z.unknown());

// Configure authenticator for enterprise requirements
authenticator.options = { window: 1 };

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mfaToken: { label: 'MFA Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            include: { organization: true },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Enterprise Security: MFA Enforcement
          if (user.mfaReady) {
            if (!credentials.mfaToken) {
              throw new CustomAuthError('MFA token is required for this account.');
            }

            const parsedMetadata = UserMetadataSchema.safeParse(user.metadata);
            const metadata = parsedMetadata.success ? parsedMetadata.data : {};
            const totpSecret = metadata.totpSecret;

            if (!totpSecret) {
              throw new CustomAuthError('MFA is enabled but no secret is configured.');
            }

            const isValid = authenticator.verify({
              token: credentials.mfaToken as string,
              secret: totpSecret,
            });

            if (!isValid) {
              throw new CustomAuthError('Invalid MFA token.');
            }
          }

          // Check if user is active
          if (!user.isActive || user.isSuspended) {
            throw new CustomAuthError('Account is suspended or inactive');
          }

          // Concurrent Session Policy & Stateless JWT tracking
          const parsedMetadata = UserMetadataSchema.safeParse(user.metadata);
          const metadata = parsedMetadata.success ? parsedMetadata.data : {};
          const activeTokens = Array.isArray(metadata.activeTokens) ? metadata.activeTokens : [];
          const now = Date.now();
          // Lazy cleanup of expired tokens
          const validTokens = activeTokens.filter((t) => t.exp > now);

          // Auto-prune oldest tokens if concurrent limit is reached to prevent lockout loop
          if (validTokens.length >= 5) {
            await AuditService.log({
              tableName: 'User',
              recordId: user.id,
              action: 'ACCESS',
              userId: user.id,
              organizationId: user.organizationId || undefined,
              newData: { status: 'CONCURRENT_SESSION_PRUNED' },
            });
            validTokens.sort((a, b) => b.exp - a.exp);
            validTokens.splice(4); // Keep most recent 4 sessions, making room for new session
          }

          // Generate new token ID and explicitly set 24h expiration
          const jti = crypto.randomUUID();
          const exp = now + 24 * 60 * 60 * 1000;
          validTokens.push({ jti, exp });
          metadata.activeTokens = validTokens;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLoginAt: new Date(),
              sessionCount: validTokens.length,
              metadata: metadata as Prisma.InputJsonValue,
            },
          });

          await AuditService.log({
            tableName: 'User',
            recordId: user.id,
            action: 'LOGIN',
            userId: user.id,
            organizationId: user.organizationId || undefined,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            organizationId: user.organizationId ?? undefined,
            jti,
          };
        } catch (error) {
          if (error instanceof CredentialsSignin) {
            throw error;
          }
          LoggerService.error('Unexpected error during credentials authorization:', error);
          return null;
        }
      },
    }),
  ],
  events: {
    async signOut(message) {
      const token = 'token' in message ? message.token : null;
      if (token && token.email && token.jti) {
        const user = await prisma.user.findUnique({
          where: { email: token.email as string },
        });

        if (user) {
          const parsedMetadata = UserMetadataSchema.safeParse(user.metadata);
          const metadata = parsedMetadata.success ? parsedMetadata.data : {};
          const activeTokens = Array.isArray(metadata.activeTokens) ? metadata.activeTokens : [];
          const updatedTokens = activeTokens.filter((t) => t.jti !== token.jti);
          metadata.activeTokens = updatedTokens;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              sessionCount: updatedTokens.length,
              metadata: metadata as Prisma.InputJsonValue,
            },
          });

          await AuditService.log({
            tableName: 'User',
            recordId: user.id,
            action: 'LOGOUT',
            userId: user.id,
            organizationId: user.organizationId || undefined,
          });
        }
      }
    },
  },
});
