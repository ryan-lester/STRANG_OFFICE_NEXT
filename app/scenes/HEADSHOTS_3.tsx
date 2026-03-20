"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Using your CloudFront URL to hit that 1TB free tier
const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";

const PHOTOS = [
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+07/STRANG_SCREENS_SLIDESHOW-21.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+07/STRANG_SCREENS_SLIDESHOW-22.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+07/STRANG_SCREENS_SLIDESHOW-23.jpg`
];

export default function HEADSHOTS_3() {
    const [index, setIndex] = useState(0);
    const SLIDE_DURATION = 60000;

    // --- LAZY PRELOADER ---
    // Only loads the next high-res image to avoid bandwidth spikes
    useEffect(() => {
        const nextIndex = (index + 1) % PHOTOS.length;
        const img = new Image();
        img.src = PHOTOS[nextIndex];
    }, [index]);

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
                    transition={{ duration: 3, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="absolute inset-0"
                >
                    <img
                        src={PHOTOS[index]}
                        className="w-full h-full object-cover"
                        alt={`Headshot 3 - Slide ${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}