import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "super-secret-key-arena-mind-production-grade",
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.organizationId = (user as any).organizationId;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).organizationId = token.organizationId as string;
      }
      return session;
    },
  },
  providers: [], // Providers that require Node.js (like Credentials with bcrypt) are added in auth.ts
} satisfies NextAuthConfig;
