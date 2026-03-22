"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from "framer-motion";

export default function AI_DETECTION_SCREEN() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Stable Resolution for GPU
    const INTERNAL_W = 2160;
    const INTERNAL_H = 1280;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // --- Configuration ---
        const targetCount = 12;
        const targets = Array.from({ length: targetCount }, (_, i) => ({
            x: Math.random() * INTERNAL_W,
            y: Math.random() * INTERNAL_H,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: 80 + Math.random() * 150,
            label: `OBJ_${Math.floor(Math.random() * 9000 + 1000)}`,
            confidence: (Math.random() * 0.3 + 0.7).toFixed(2), // 0.70 to 0.99
            color: i === 0 ? "#ff003c" : "rgba(255, 255, 255, 0.6)"
        }));

        const render = () => {
            // 1. "Trailing" Clear (Creates a slight ghosting/motion blur effect)
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
            ctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);

            // 2. Draw Connection Lines (The "Web" effect)
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < targets.length; i++) {
                for (let j = i + 1; j < targets.length; j++) {
                    const dist = Math.sqrt(
                        Math.pow(targets[i].x - targets[j].x, 2) +
                        Math.pow(targets[i].y - targets[j].y, 2)
                    );
                    // Only connect if they are somewhat close
                    if (dist < 600) {
                        ctx.moveTo(targets[i].x, targets[i].y);
                        ctx.lineTo(targets[j].x, targets[j].y);
                    }
                }
            }
            ctx.stroke();

            // 3. Draw Bounding Boxes and Labels
            targets.forEach((t) => {
                // Update Position
                t.x += t.vx;
                t.y += t.vy;

                // Bounce
                if (t.x < 0 || t.x > INTERNAL_W) t.vx *= -1;
                if (t.y < 0 || t.y > INTERNAL_H) t.vy *= -1;

                // Draw Box
                ctx.strokeStyle = t.color;
                ctx.lineWidth = 2;
                ctx.strokeRect(t.x - t.size / 2, t.y - t.size / 2, t.size, t.size);

                // Draw "Corners" (That classic AI look)
                const cLen = 20;
                ctx.lineWidth = 4;
                ctx.beginPath();
                // Top Left
                ctx.moveTo(t.x - t.size/2, t.y - t.size/2 + cLen);
                ctx.lineTo(t.x - t.size/2, t.y - t.size/2);
                ctx.lineTo(t.x - t.size/2 + cLen, t.y - t.size/2);
                // Bottom Right
                ctx.moveTo(t.x + t.size/2, t.y + t.size/2 - cLen);
                ctx.lineTo(t.x + t.size/2, t.y + t.size/2);
                ctx.lineTo(t.x + t.size/2 - cLen, t.y + t.size/2);
                ctx.stroke();

                // Draw Data Label
                ctx.fillStyle = t.color;
                ctx.font = "bold 16px monospace";
                ctx.fillText(`${t.label} [CONF: ${t.confidence}]`, t.x - t.size / 2, t.y - t.size / 2 - 10);

                // Occasional "Glitch" shift
                if (Math.random() > 0.98) {
                    ctx.fillRect(t.x - t.size / 2, t.y, t.size, 2);
                }
            });

            requestAnimationFrame(render);
        };

        const animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-[6480px] h-[3840px] bg-black relative overflow-hidden flex items-center justify-center"
        >
            <canvas
                ref={canvasRef}
                width={INTERNAL_W}
                height={INTERNAL_H}
                style={{
                    width: '100%',
                    height: '100%',
                    imageRendering: 'pixelated',
                    filter: 'contrast(1.4) brightness(1.1) saturate(0)' // Pure Grayscale Gritty Look
                }}
            />

            {/* Interface Overlay */}
            <div className="absolute top-[100px] left-[100px] text-white font-mono mix-blend-difference pointer-events-none">
                <div className="text-[120px] font-bold leading-none">ANALYSIS_MODE_v4</div>
                <div className="text-[40px] opacity-50 mt-4 tracking-widest uppercase">
                    Neural_Link: Active // Scan_Sarasota_Site_01
                </div>
            </div>

            {/* Global Scanning Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
    );
}