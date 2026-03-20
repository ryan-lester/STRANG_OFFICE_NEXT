"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Swapping to your CloudFront domain to keep the budget at $0
const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";
const IMAGE_URL = `${CF_URL}/mitch_slideshows_march_2026/Slideshow+01/STRANG_SCREENS_SLIDESHOW-1.jpg`;

export default function SLIDESHOW_VDV_WIDE() {
    const DISPLAY_DURATION = 180000; // 3 minutes
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % 1);
        }, DISPLAY_DURATION);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={IMAGE_URL}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={IMAGE_URL}
                        className="w-full h-full object-cover"
                        alt="VDV Wide Slideshow"
                        onLoad={() => console.log("Image loaded successfully:", IMAGE_URL)}
                        onError={(e) => console.error("IMAGE FAILED TO LOAD. Check this URL:", IMAGE_URL)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}