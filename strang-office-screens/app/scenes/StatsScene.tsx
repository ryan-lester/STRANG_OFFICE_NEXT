"use client";
import { motion } from "framer-motion";

export default function StatsScene() {
    return (
        <div className="w-[6480px] h-[3840px] bg-white text-black p-[200px] grid grid-cols-3 gap-[120px] font-din-condensed">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="border-t-[20px] border-black pt-10"
                >
                    <div className="text-[200px] leading-none mb-10">0{i}</div>
                    <div className="text-[80px] leading-tight tracking-wider uppercase">
                        Project Milestone <br /> Achievement 2026
                    </div>
                </motion.div>
            ))}
        </div>
    );
}