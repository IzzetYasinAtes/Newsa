/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@newsa/ui', '@newsa/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Common CDN/image hosting patterns for external article images
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
  },
  // Compress responses
  compress: true,
}

module.exports = nextConfig
