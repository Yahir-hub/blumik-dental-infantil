import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  turbopack: {
    root: process.cwd(),
    resolveAlias: process.env.HYRONIX_ENVIRONMENT === 'staging'
      ? { '@/lib/hyronix/local-store': './lib/hyronix/disabled-local-store.ts' }
      : {},
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...(process.env.HYRONIX_ENVIRONMENT === 'staging'
            ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
            : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
