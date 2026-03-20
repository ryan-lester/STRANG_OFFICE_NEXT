"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. Replace this with your new CloudFront domain!
const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";

const IMAGES = [
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-5.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-6.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-7.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-8.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-9.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-10.jpg`,
];

export default function SLIDESHOW_WILDWOOD_PALM() {
    const [index, setIndex] = useState(0);
    const DISPLAY_DURATION = 30000; // 30 seconds

    // --- LAZY PRELOADER ---
    // Instead of downloading everything, we only "peek" at the next image
    useEffect(() => {
        const nextIndex = (index + 1) % IMAGES.length;
        const img = new Image();
        img.src = IMAGES[nextIndex];
        // This puts the NEXT image in the browser cache 30s before it's needed
    }, [index]); // Re-runs every time the slide changes

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % IMAGES.length);
        }, DISPLAY_DURATION);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={IMAGES[index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="absolute inset-0"
                >
                    <img
                        src={IMAGES[index]}
                        className="w-full h-full object-cover"
                        alt={`Slide ${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}