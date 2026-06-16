import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: wordpressHostname
      ? [
        {
          protocol: "https",
          hostname: wordpressHostname, // Dùng biến động thay vì viết chết tên miền
          port: "",
          pathname: "/**",
        },
        {
          protocol: "http", // Thêm cấu hình này để phòng trường hợp WordPress trả về link http
          hostname: wordpressHostname,
          port: "",
          pathname: "/**",
        },
      ]
      : [],
  },
  async redirects() {
    if (!wordpressUrl) {
      return [];
    }
    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
