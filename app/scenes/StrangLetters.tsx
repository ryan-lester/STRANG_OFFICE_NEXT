"use client";
import { useEffect, useRef } from "react";

export default function StrangLetters() {
    const forwardRef = useRef<HTMLVideoElement>(null);
    const backwardRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fwd = forwardRef.current;
        const bwd = backwardRef.current;
        if (!fwd || !bwd) return;

        // Start the sequence
        const playForward = () => {
            fwd.currentTime = 0;
            fwd.style.opacity = "1"; // Fade in top layer
            fwd.play().catch(() => {});
        };

        const playBackward = () => {
            bwd.currentTime = 0;
            bwd.play().catch(() => {});
            fwd.style.opacity = "0"; // Fade out top layer to reveal bottom layer
        };

        // Ping-pong the videos using native browser events
        fwd.onended = playBackward;
        bwd.onended = playForward;

        // Kick it off
        playForward();

        return () => {
            fwd.onended = null;
            bwd.onended = null;
        };
    }, []);

    return (
        <div className="w-[6480px] h-[3840px] bg-white relative overflow-hidden">

            {/* BACKWARD PLAYER (Bottom Layer - Always opaque) */}
            <video
                ref={backwardRef}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain px-[10%] pointer-events-none z-10"
                src="/strang_letters/strang_letters_4k_backwards.mov"
            />

            {/* FORWARD PLAYER (Top Layer - Fades in and out) */}
            <video
                ref={forwardRef}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain px-[10%] pointer-events-none z-20 transition-opacity duration-300"
                src="/strang_letters/strang_letters_4k_forward.mov"
            />

        </div>
    );
}