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
        ],
    },
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Increase if needed
        },
    },
    experimental: {
        serverComponentsExternalPackages: ['cloudinary'],
    },
};

export default nextConfig;
