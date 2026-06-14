/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local seed images live in /public/images; no remote patterns needed in Phase 1.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
