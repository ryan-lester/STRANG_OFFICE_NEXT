"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Using your CloudFront URL to hit that 1TB free tier
const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";

const IMAGES = [
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow 13/Strang Foyer update34-2.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow 13/Strang Foyer update35-2.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow 13/Strang Foyer update36-2.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow 13/Strang Foyer update37-2.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow 13/Strang Foyer update38-2.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow 13/Strang Foyer update39-2.jpg`,
];

export default function SLIDESHOW_FIVEPALMS_REVERSREACH() {
    const [index, setIndex] = useState(0);
    const DISPLAY_DURATION = 30000; // 30 seconds

    // --- LAZY PRELOADER ---
    // Instead of downloading all high-res files at once,
    // we only grab the next one while the current one is being viewed.
    useEffect(() => {
        const nextIndex = (index + 1) % IMAGES.length;
        const img = new Image();
        img.src = IMAGES[nextIndex];
    }, [index]);

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