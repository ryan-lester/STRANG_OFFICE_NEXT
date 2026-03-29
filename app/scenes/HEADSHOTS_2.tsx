"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Using your new CloudFront domain for all assets
const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";

const PHOTOS = [
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+04/Foyer_Slideshow+04+update_01-4.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+04/Foyer_Slideshow+04+update_02-5.jpg`,
    `${CF_URL}/mitch_slideshows_march_2026/Slideshow+04/Foyer_Slideshow+04+update_03-6.jpg`
];

export default function HEADSHOTS_2() {
    const [index, setIndex] = useState(0);
    const SLIDE_DURATION = 60000; // 1 minute

    // --- LAZY PRELOADER ---
    // Grabs only the NEXT image to keep your AWS credit usage at $0.
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
                        alt={`Headshot 2 - Slide ${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}