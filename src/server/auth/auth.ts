import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';
import { AuditService } from '../audit/audit.service';
import crypto from 'crypto';

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { organization: true },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Enterprise Security: MFA Enforcement
        if (user.mfaReady) {
          if (!credentials.mfaToken) {
            throw new Error('MFA token is required for this account.');
          }
          // In a real implementation, we would verify the TOTP token here.
          // For now, we simulate the validation.
          if (credentials.mfaToken !== '000000' && credentials.mfaToken.toString().length !== 6) {
            throw new Error('Invalid MFA token.');
          }
        }

        // Check if user is active
        if (!user.isActive || user.isSuspended) {
          throw new Error('Account is suspended or inactive');
        }

        // Concurrent Session Policy & Stateless JWT tracking
        const metadata = (user.metadata as any) || {};
        const activeTokens = Array.isArray(metadata.activeTokens) ? metadata.activeTokens : [];
        const now = Date.now();

        // Lazy cleanup of expired tokens
        const validTokens = activeTokens.filter((t: any) => t.exp > now);

        if (validTokens.length >= 5) {
          await AuditService.log({
            tableName: 'User',
            recordId: user.id,
            action: 'ACCESS',
            userId: user.id,
            organizationId: user.organizationId || undefined,
            newData: { status: 'CONCURRENT_SESSION_LIMIT_REACHED' },
          });
          throw new Error(
            'Maximum concurrent sessions reached. Please log out from other devices.'
          );
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
            metadata,
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
          const metadata = (user.metadata as any) || {};
          const activeTokens = Array.isArray(metadata.activeTokens) ? metadata.activeTokens : [];
          const updatedTokens = activeTokens.filter((t: any) => t.jti !== token.jti);
          metadata.activeTokens = updatedTokens;

          await prisma.user.update({
            where: { id: user.id },
            data: { sessionCount: updatedTokens.length, metadata },
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
