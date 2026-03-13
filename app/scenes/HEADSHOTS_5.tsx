"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = [
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+11/STRANG_SCREENS_SLIDESHOW-29.jpg",
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+11/STRANG_SCREENS_SLIDESHOW-30.jpg",
    "https://strang-screens.s3.us-east-2.amazonaws.com/mitch_slideshows_march_2026/Slideshow+11/STRANG_SCREENS_SLIDESHOW-31.jpg"
];

export default function HEADSHOTS_5() {
    const [index, setIndex] = useState(0);
    const SLIDE_DURATION = 60000;

    // --- PRELOADER ---
    useEffect(() => {
        PHOTOS.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % PHOTOS.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={PHOTOS[index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // Increased duration to 3s and changed ease for a "softer" feel
                    transition={{ duration: 3, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="absolute inset-0"
                >
                    <img
                        src={PHOTOS[index]}
                        className="w-full h-full object-cover"
                        alt={`Headshot 1 - Slide ${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}