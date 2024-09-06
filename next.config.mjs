/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ["./app/_styles/"],
  },
  images: {
    domains: ["maps.googleapis.com"],
  },
};

export default nextConfig;
