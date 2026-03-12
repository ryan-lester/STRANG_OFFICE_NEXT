"use client";
import { motion } from "framer-motion";

export default function TimelapseScene() {
    return (
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            {/* Background Video Layer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    // Replace with your actual timelapse file path in /public/videos/
                    src="/timelapse/strang_timelapses_4k.mov"
                />

                {/* Subtle Vignette to keep corner text legible */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </motion.div>

            {/* Optional: Minimalist Labeling in the center screen zone */}
            <div className="absolute left-[2160px] top-0 w-[2160px] h-[3840px] flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="text-center"
                >
                    <div className="h-[2px] w-24 bg-white/50 mx-auto mb-8" />
                    <h2 className="font-din-condensed text-[80px] tracking-[0.4em] text-white/80 uppercase">
                    </h2>
                </motion.div>
            </div>
        </div>
    );
}