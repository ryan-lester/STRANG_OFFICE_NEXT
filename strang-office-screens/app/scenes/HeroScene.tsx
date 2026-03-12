"use client";
import { motion } from "framer-motion";

export default function HeroScene() {
    return (
        <div className="w-[6480px] h-[3840px] bg-zinc-900 relative overflow-hidden">
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0"
            >
                {/* Replace with an actual high-res image path */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=6480')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-black/20" />
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="font-din-condensed text-[300px] tracking-[50px] text-white/90 mix-blend-overlay">
                    RESIDENTIAL
                </h2>
            </div>
        </div>
    );
}