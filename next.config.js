/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
      unoptimized: true,
    },
    basePath: "/talrop-website",
    assetPrefix: "/talrop-website/",
  };
  
  module.exports = nextConfig;
  