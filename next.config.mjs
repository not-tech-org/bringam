/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use server components properly
  reactStrictMode: true,

  // Ensure images work properly
  images: {
    domains: ["*"],
    unoptimized: true,
  },

  // Prevent static optimization to avoid localStorage errors
  experimental: {
    // This helps with dynamic content
    appDir: true,
    // Skip static optimization for pages using localStorage
    optimizeCss: false,
    optimizeServerReact: false,
  },

  // Ensure we don't process pages statically
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
