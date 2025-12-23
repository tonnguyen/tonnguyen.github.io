/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages (only in production)
  ...(process.env.NODE_ENV === 'production' && {
    output: process.env.BUILD_EXPORT ? 'export' : undefined,
    trailingSlash: true,
    basePath: '',
    assetPrefix: '.',
  }),
  
  // Enable image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Only disable optimization for static export (GitHub Pages)
    // Vercel supports image optimization natively
    unoptimized: process.env.BUILD_EXPORT === 'true',
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundle size
  experimental: {
    optimizeCss: true,
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      };
      
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
};

module.exports = nextConfig; 