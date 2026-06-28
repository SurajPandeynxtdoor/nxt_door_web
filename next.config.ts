// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nxtdoorproductsimage.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.onlytruthnosecrets.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // On deployments that should serve the PointMax tool as the landing page
  // (set POINTS_AS_HOME=true), send the root URL to /points. The storefront
  // deployment leaves this unset and keeps "/" as its home.
  redirects: async () => {
    if (process.env.POINTS_AS_HOME !== "true") return [];
    return [
      {
        source: "/",
        destination: "/points",
        permanent: false,
      },
    ];
  },
  headers: async () => {
    return [
      {
        source: "/:all*(css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
