import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'strang-screens.s3.us-east-2.amazonaws.com',
                port: '',
                // This targets your specific March 2026 project folder and all subfolders
                pathname: '/mitch_slideshows_march_2026/**',
            },
            {
                protocol: 'https',
                hostname: 'strang-screens.s3.us-east-2.amazonaws.com',
                port: '',
                pathname: '/staff-headshots/**',
            },
        ],
    },
};

export default nextConfig;