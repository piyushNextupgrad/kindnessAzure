/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  basePath: "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // env: {
  //   NEXT_APP_ENV: process.env.NEXT_APP_ENV,
  //   SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  //   API_URL: process.env.NEXT_PUBLIC_API_URL,
  //   BASEURL: process.env.BASEURL,
  //   BASE_LIVE_URL: process.env.NEXT_PUBLIC_BASE_LIVE_URL,
  //   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
  //     process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  //   STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  // },
};

module.exports = nextConfig;
