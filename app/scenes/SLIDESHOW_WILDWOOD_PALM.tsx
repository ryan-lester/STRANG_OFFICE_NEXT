"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-5.jpg",
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-6.jpg",
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-7.jpg",
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-8.jpg",
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-9.jpg",
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+03/STRANG_SCREENS_SLIDESHOW-10.jpg",
];

export default function SLIDESHOW_WILDWOOD_PALM() {
    const [index, setIndex] = useState(0);
    const DISPLAY_DURATION = 30000; // 30 seconds

    // --- PRELOADER ---
    // This ensures images are in the browser cache before they need to display
    useEffect(() => {
        IMAGES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

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
                    // Using the URL as the key to match reference style
                    key={IMAGES[index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // Matches the "softer" feel transition from your reference
                    transition={{ duration: 3, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="absolute inset-0"
                >
                    <img
                        src={IMAGES[index]}
                        className="w-full h-full object-cover"
                        alt={`Slide ${index + 1}`}
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}