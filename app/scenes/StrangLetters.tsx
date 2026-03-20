"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function StrangLetters() {
    const [isReady, setIsReady] = useState(false);
    const forwardRef = useRef<HTMLVideoElement>(null);
    const backwardRef = useRef<HTMLVideoElement>(null);

    // Using CloudFront to keep video streaming in the 1TB Free Tier
    const CF_URL = "https://d3arwlkv4f48kq.cloudfront.net";
    const FWD_VIDEO = `${CF_URL}/strang_letters/strang_letters_4k_forward.mov`;
    const BWD_VIDEO = `${CF_URL}/strang_letters/strang_letters_4k_backwards.mov`;

    useEffect(() => {
        const fwd = forwardRef.current;
        const bwd = backwardRef.current;
        if (!fwd || !bwd) return;

        // Logic for seamless looping between forward and backward videos
        const playForward = () => {
            if (!fwd) return;
            fwd.currentTime = 0;
            fwd.style.opacity = "1";
            fwd.play().catch(() => {});
        };

        const playBackward = () => {
            if (!bwd || !fwd) return;
            bwd.currentTime = 0;
            bwd.play().catch(() => {});
            fwd.style.opacity = "0";
        };

        fwd.onended = playBackward;
        bwd.onended = playForward;

        fwd.oncanplaythrough = () => {
            setIsReady(true);
            playForward();
        };

        return () => {
            fwd.onended = null;
            bwd.onended = null;
            fwd.oncanplaythrough = null;
        };
    }, []);

    // Layout for 3-screen setup (6480px total)
    // Limits the video to the center screen (2160px)
    const videoClassName = "absolute top-0 left-1/3 w-1/3 h-full object-contain pointer-events-none";

    return (
        <div className="w-[6480px] h-[3840px] bg-black relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isReady ? 1 : 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-full h-full bg-white relative"
            >
                {/* BACKWARD PLAYER */}
                <video
                    ref={backwardRef}
                    muted
                    playsInline
                    preload="auto"
                    className={`${videoClassName} z-10`}
                    src={BWD_VIDEO}
                />

                {/* FORWARD PLAYER */}
                <video
                    ref={forwardRef}
                    muted
                    playsInline
                    preload="auto"
                    className={`${videoClassName} z-20 transition-opacity duration-300`}
                    src={FWD_VIDEO}
                />
            </motion.div>
        </div>
    );
}