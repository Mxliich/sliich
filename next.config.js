/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['sliich.vercel.app'], // أضف النطاقات التي تستخدمها
  },
}

module.exports = nextConfig 
