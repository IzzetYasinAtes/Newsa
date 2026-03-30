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
    ],
  },
}

module.exports = nextConfig
