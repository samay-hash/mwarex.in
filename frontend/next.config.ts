import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Fix: Google indexed /auth/login but route is /auth/signin
      {
        source: "/auth/login",
        destination: "/auth/signin",
        permanent: true, // 301 redirect — tells Google permanently moved
      },
      // Fix: www → non-www canonical redirect
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mwarex.in" }],
        destination: "https://mwarex.in/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
