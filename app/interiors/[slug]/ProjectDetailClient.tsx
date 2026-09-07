"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';

// Explicitly define how Sanity should render standard paragraphs to restore spacing
const portableTextComponents = {
    block: {
        normal: ({ children }: any) => <p className="mb-5 last:mb-0">{children}</p>,
    },
};

export default function ProjectDetailClient({ project }: { project: any }) {
    const [shuffledImages, setShuffledImages] = useState<string[]>([]);

    // Randomize images on the client side to avoid Next.js hydration errors
    useEffect(() => {
        if (project.images && project.images.length > 0) {
            const array = [...project.images];
            // Fisher-Yates shuffle algorithm for an even randomization
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            setShuffledImages(array);
        }
    }, [project.images]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen w-full bg-white text-black p-6 md:p-12 lg:p-16"
            style={{ fontFamily: '"Neue Haas Grotesk Display Pro", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
            {/* Back Link */}
            <div className="mb-8 lg:mb-12 max-w-[1800px] mx-auto">
                <Link href="/interiors" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                    ← Back to Projects
                </Link>
            </div>

            {/* Top Section - Forced side-by-side split on medium screens and up */}
            <div className="flex flex-col md:flex-row gap-10 lg:gap-16 max-w-[1800px] mx-auto items-start">

                {/* Left Column: Text & Info (Locked to ~35% width) */}
                <div className="w-full md:w-[35%] flex flex-col shrink-0">
                    <h1
                        className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-none tracking-tight mb-6 lg:mb-8 text-zinc-800"
                        style={{ fontFamily: '"DIN Pro Condensed", "DIN Alternate", sans-serif' }}
                    >
                        {project.title}
                    </h1>

                    <div className="text-zinc-500 text-sm md:text-base leading-relaxed font-light max-w-none">
                        {project.description ? (
                            <PortableText
                                value={project.description}
                                components={portableTextComponents}
                            />
                        ) : null}
                    </div>

                    <div className="mt-12 lg:mt-16 uppercase text-xs md:text-sm tracking-widest text-zinc-400">
                        <h3 className="font-bold text-zinc-800 mb-4 lg:mb-6 font-sans">PROJECT INFORMATION</h3>
                        <div className="grid grid-cols-[130px_1fr] gap-y-2 lg:gap-y-3 font-light">
                            {project.location && (
                                <>
                                    <span>LOCATION</span>
                                    <span>{project.location}</span>
                                </>
                            )}
                            {project.dateCompleted && (
                                <>
                                    <span>DATE COMPLETED</span>
                                    <span>{project.dateCompleted}</span>
                                </>
                            )}
                            {project.squareFootage && (
                                <>
                                    <span>SQUARE FOOTAGE</span>
                                    <span>{project.squareFootage}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Cover Photo (Locked to ~65% width) */}
                <div className="w-full md:w-[65%]">
                    {project.coverPhoto && (
                        <img
                            src={project.coverPhoto}
                            alt={`${project.title} Cover`}
                            className="w-full h-auto object-cover bg-zinc-50"
                        />
                    )}
                </div>
            </div>

            {/* Bottom Section: Denser Masonry Gallery Collage */}
            {shuffledImages.length > 0 && (
                <div className="mt-16 md:mt-24 max-w-[1800px] mx-auto">
                    {/* Increased column count to force smaller, collage-style images */}
                    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                        {shuffledImages.map((imgSrc: string, i: number) => (
                            <div key={i} className="break-inside-avoid">
                                <img
                                    src={imgSrc}
                                    alt={`${project.title} Gallery Image ${i + 1}`}
                                    className="w-full h-auto object-cover bg-zinc-100"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.main>
    );
}