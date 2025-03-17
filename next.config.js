/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['your-domain.com'], // أضف النطاقات التي تستخدمها
  },
}

module.exports = nextConfig 
