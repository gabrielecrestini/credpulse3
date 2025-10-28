/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aggiungiamo questa sezione per autorizzare i domini delle immagini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'asset.brandfetch.io', // Autorizza il dominio dei loghi
        port: '',
        pathname: '/**', // Autorizza qualsiasi immagine da questo host
      },
    ],
  },
};

export default nextConfig;
