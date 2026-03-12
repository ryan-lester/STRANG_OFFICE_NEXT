"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ARCH_PHOTOS = [
    "/vdv_photos/2CBA3AB7-DCF0-4E6A-BB9C-A5AE82A937C3.jpeg",
    "/vdv_photos/3B55FC7B-BAC7-4171-89F9-0193084086A8.jpeg",
    "/vdv_photos/70D2B76E-BDD4-4A70-92FD-74296AB5EED0.jpeg",
    "/vdv_photos/AB6DBCD8-E969-4915-9EF4-7731B095D2B3.jpeg",
    "/vdv_photos/ABEB9D98-4769-4040-A5DA-BF68E395674C.jpeg",
    "/vdv_photos/F398BC3F-9960-4CAB-BA54-EDB0DA868428.jpeg",
    "/vdv_photos/F819464D-53DD-45CE-A8E1-B0F969F4BA42.jpeg",
    "/vdv_photos/IMG_0002.jpeg",
    "/vdv_photos/IMG_0006.jpeg",
    "/vdv_photos/IMG_0011.jpeg",
    "/vdv_photos/IMG_0016.jpeg"
];

export default function ArchitectureScene() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % ARCH_PHOTOS.length);
        }, 10000); // 10 seconds per photo
        return () => clearInterval(timer);
    }, []);

    return (
        /* The container is the full panoramic width.
           The page.tsx "window" pans across this. */
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={ARCH_PHOTOS[index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* One single image fills the entire 6480x3840 span */}
                    <img
                        src={ARCH_PHOTOS[index]}
                        className="w-full h-full object-cover"
                        alt="Architecture Project Panoramic"
                    />

                    {/* Subtle aesthetic gradient spanning the whole wall */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}