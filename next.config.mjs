/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Phase 1 ships no real photos; all <Image> usage points at local /public/images
  // files that may be absent, so we keep optimization simple and unoptimized to
  // avoid build-time fetches. Local files still benefit from lazy loading + sizes.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
