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
};

export default nextConfig;
