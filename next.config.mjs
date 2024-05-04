import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ayvom5vlizclv37r.public.blob.vercel-storage.com',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(process.cwd(), 'cards.json'),
  },
};

export default nextConfig;
