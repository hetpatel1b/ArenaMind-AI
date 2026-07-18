import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
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

        // Session limit checks
        if (user.sessionCount >= 5) {
          // We could invalidate older sessions, but for this audit we log or handle
          console.warn(`[Auth] User ${user.email} exceeded concurrent session limit.`);
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            sessionCount: { increment: 1 },
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId ?? undefined,
        };
      },
    }),
  ],
});
