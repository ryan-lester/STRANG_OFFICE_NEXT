"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Swapped to CloudFront to hit the 1TB Free Tier
const CF_BASE_URL = "https://d3arwlkv4f48kq.cloudfront.net/staff-headshots";

const PHOTOS = Array.from({ length: 15 }, (_, i) =>
    `${CF_BASE_URL}/strang_slides-${i + 2}.jpg`
);

export default function HeadshotsScene() {
    const [index, setIndex] = useState(0);

    // --- LAZY PRELOADER ---
    // With 15 massive panoramic images, we ONLY want to load the next one.
    useEffect(() => {
        const nextIndex = (index + 1) % PHOTOS.length;
        const img = new Image();
        img.src = PHOTOS[nextIndex];
    }, [index]);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % PHOTOS.length);
        }, 10000); // 10 second rotation
        return () => clearInterval(timer);
    }, []);

    return (
        /* The container is the full panoramic width.
           The page.tsx "window" pans across this. */
        <div className="w-[6480px] h-[3840px] bg-black relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={PHOTOS[index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* One single image fills the entire 6480x3840 span */}
                    <img
                        src={PHOTOS[index]}
                        className="w-full h-full object-cover"
                        alt="Staff Headshot Panoramic"
                    />

                    {/* Subtle aesthetic gradient spanning the whole wall */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}