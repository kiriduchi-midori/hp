/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  generateBuildId: async () => {
    return 'red-cabinet'
  },
  output: 'export'
};

export default nextConfig;
