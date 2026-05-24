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

  // ✅ Required: Excalidraw ships ESM-only packages that Next.js cannot bundle
  // without explicit transpilation. Without this, the canvas renders blank.
  transpilePackages: [
    "@excalidraw/excalidraw",
    "@excalidraw/laser-pointer",
    "@excalidraw/mermaid-to-excalidraw",
    "@excalidraw/random-username",
  ],

  // ✅ Required for Next.js 16+ (Turbopack default) — silences the webpack/turbopack mismatch error
  turbopack: {},

  devIndicators: {
    appIsrStatus: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

