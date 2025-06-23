// next.config.mjs (or next.config.js)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // Or be more specific if you know your project ID and dataset
      },
    ],
  },
  // ... any other configurations you might have
};

export default nextConfig; // If using ES Modules (default for .mjs)
// Or: module.exports = nextConfig; (if using CommonJS - typically for .js)