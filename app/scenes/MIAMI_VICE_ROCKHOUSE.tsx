"use client";
import { motion } from "framer-motion";

export default function MIAMI_VICE_ROCKHOUSE() {
    // Switched to CloudFront to protect your $100 credits
    const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";
    const VIDEO_URL = `${CF_URL}/videos/MIAMI_VICE_VIDEO.mp4`;

    return (
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            {/* Background Video Layer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    src={VIDEO_URL}
                />

                {/* Subtle Vignette to keep corner text legible */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </motion.div>

            {/* Center screen zone (2160px width) */}
            <div className="absolute left-[2160px] top-0 w-[2160px] h-[3840px] flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="text-center"
                >
                    <h2 className="font-din-condensed text-[80px] tracking-[0.4em] text-white/80 uppercase">
                        {/* Title text */}
                    </h2>
                </motion.div>
            </div>
        </div>
    );
}