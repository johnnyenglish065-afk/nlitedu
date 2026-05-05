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
  },

  // Base path and asset prefix for GitHub Pages
  // basePath: "/nexgen-tech",
  // assetPrefix: "/nexgen-tech",
  basePath: "",
  assetPrefix: "",

  // Use output export for static generation
  // Removed output: "export" to enable Next.js API Routes on Vercel
  images: {
    unoptimized: true, // ✅ This is the key fix
  },
  devIndicators: {
    appIsrStatus: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

module.exports = nextConfig;
