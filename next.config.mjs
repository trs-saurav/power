/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            },
        ],
    },
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Increase if needed
        },
    },
    experimental: {
        serverComponentsExternalPackages: ['cloudinary', 'next-auth', 'openid-client'],
    },
};

export default nextConfig;
