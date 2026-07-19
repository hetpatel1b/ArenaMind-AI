import type { NextAuthConfig } from 'next-auth';
import { UserRole } from '@prisma/client';

// FINAL FIX FOR VERCEL HOST MISMATCH (UntrustedHost)
// If NextAuth sees localhost:3000 in Vercel Env, it crashes. We override it dynamically here.
if (process.env.VERCEL_URL) {
  process.env.AUTH_URL = `https://${process.env.VERCEL_URL}`;
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export const authConfig = {
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'super-secret-key-arena-mind-production-grade',
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.id = user.id;
        if ('jti' in user) {
          token.jti = user.jti as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
  },
  providers: [], // Providers that require Node.js (like Credentials with bcrypt) are added in auth.ts
} satisfies NextAuthConfig;
