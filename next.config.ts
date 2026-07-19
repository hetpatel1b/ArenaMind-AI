import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn', 'info'] } : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  logging: {
    // Disable browser console forwarding to terminal to suppress transient
    // "Failed to fetch" errors from Supabase/next-auth during development
    browserToTerminal: false,
  },
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (process.env.NEXT_PUBLIC_E2E_MODE === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      config.resolve.alias['@/lib/db/client'] = path.resolve(
        __dirname,
        'tests/e2e/mocks/prisma.mock.ts'
      );
    }
    return config;
  },
  turbopack: {
    resolveAlias:
      process.env.NEXT_PUBLIC_E2E_MODE === 'true'
        ? {
            '@/lib/db/client': './tests/e2e/mocks/prisma.mock.ts',
          }
        : undefined,
  },
};

import { withSentryConfig } from '@sentry/nextjs';

export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
});
