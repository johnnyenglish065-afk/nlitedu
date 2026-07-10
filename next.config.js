/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nlitedu.com",
        port: "",
      },
    ],
    unoptimized: true,
  },

  basePath: "",
  assetPrefix: "",

  // Fabric.js is CommonJS-compatible — no special transpilation needed

  // ✅ Required for Next.js 16+ (Turbopack default) — silences the webpack/turbopack mismatch error
  turbopack: {},

  // ✅ Allow native Node.js modules to load in server routes
  serverExternalPackages: ["@napi-rs/canvas"],

  devIndicators: {
    appIsrStatus: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

