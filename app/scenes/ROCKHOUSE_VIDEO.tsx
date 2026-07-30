"use client";
import { motion } from "framer-motion";
import { SyncedVideo, SceneProps } from "@/app/components/SyncedVideo";

// Switched to CloudFront to protect your $100 credits
const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";
export const VIDEO_URL = `${CF_URL}/videos/Strang_RockHouse_Screens.mp4`;

export default function RockHouseVideo({ syncStartTime }: SceneProps) {
    return (
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            {/* Background Video Layer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0"
            >
                {/* Was: raw <video autoPlay loop> with no syncStartTime — each
                    screen just autoplayed independently whenever it happened to
                    finish buffering, with zero connection to the other two.
                    Now driven by SyncedVideo, which fully preloads the file and
                    locks playback to the shared syncStartTime broadcast from the
                    center screen. No autoPlay/loop here on purpose — restart on
                    each pass is handled by the scene scheduler in page.tsx
                    (matching how every other scene in MASTER_SCENES loops),
                    so letting the native <video> loop too would just race it. */}
                <SyncedVideo
                    src={VIDEO_URL}
                    syncStartTime={syncStartTime}
                    className="w-full h-full object-cover"
                />

                {/* Subtle Vignette to keep corner text legible */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </motion.div>

            {/* Center screen zone (2160px width) */}
            <div className="absolute left-[2160px] top-0 w-[2160px] h-[3840px] flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="text-center"
                >
                    <h2 className="font-din-condensed text-[80px] tracking-[0.4em] text-white/80 uppercase">
                        {/* Title text */}
                    </h2>
                </motion.div>
            </div>
        </div>
    );
}