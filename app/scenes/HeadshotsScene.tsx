"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = Array.from({ length: 15 }, (_, i) => `/strang_headshots/strang_slides-${i + 2}.jpg`);

export default function HeadshotsScene() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % PHOTOS.length);
        }, 10000);
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