"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function StrangLetters() {
    const [isReady, setIsReady] = useState(false);
    const forwardRef = useRef<HTMLVideoElement>(null);
    const backwardRef = useRef<HTMLVideoElement>(null);

    const FWD_VIDEO = "https://strang-screens.s3.us-east-2.amazonaws.com/strang_letters/strang_letters_4k_forward.mov";
    const BWD_VIDEO = "https://strang-screens.s3.us-east-2.amazonaws.com/strang_letters/strang_letters_4k_backwards.mov";

    useEffect(() => {
        const fwd = forwardRef.current;
        const bwd = backwardRef.current;
        if (!fwd || !bwd) return;

        const playForward = () => {
            fwd.currentTime = 0;
            fwd.style.opacity = "1";
            fwd.play().catch(() => {});
        };

        const playBackward = () => {
            bwd.currentTime = 0;
            bwd.play().catch(() => {});
            fwd.style.opacity = "0";
        };

        fwd.onended = playBackward;
        bwd.onended = playForward;

        // Start the logic only after the browser confirms it can play the file
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
                    className="absolute inset-0 w-full h-full object-contain px-[10%] pointer-events-none z-10"
                    src={BWD_VIDEO}
                />

                {/* FORWARD PLAYER */}
                <video
                    ref={forwardRef}
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-contain px-[10%] pointer-events-none z-20 transition-opacity duration-300"
                    src={FWD_VIDEO}
                />
            </motion.div>
        </div>
    );
}