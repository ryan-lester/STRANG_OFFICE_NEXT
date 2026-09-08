"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';

const portableTextComponents = {
    block: {
        normal: ({ children }: any) => <p className="mb-5 last:mb-0">{children}</p>,
    },
};

// Component to handle individual image loading states with a spinner
function GalleryImage({ src, alt }: { src: string; alt: string }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="break-inside-avoid pb-4 md:pb-6 mt-0 w-full relative">
            <div className="relative w-full bg-zinc-50 min-h-[200px] flex items-center justify-center">

                {/* Spinning Black Circle Loader */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                )}

                {/*
                    Image stays invisible (opacity-0) until onLoad fires.
                    Once loaded, it fades in smoothly over 700ms.
                */}
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    className={`block w-full h-auto object-cover transition-opacity duration-700 ease-in-out ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export default function ProjectDetailClient({ project }: { project: any }) {
    const [shuffledImages, setShuffledImages] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (project?.images && project.images.length > 0) {
            const array = [...project.images];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            setShuffledImages(array);
        }
    }, [project?.images]);

    // Safety check just in case project data isn't loaded yet
    if (!project) return null;

    return (
        /*
            FIX: The static white background is now on a non-animating wrapper.
            This prevents the default black/dark background from bleeding through
            while the motion div is at opacity 0.
        */
        <div
            className="min-h-screen w-full bg-white text-black"
            style={{ fontFamily: '"DIN Pro Condensed", "DIN Alternate", sans-serif' }}
        >
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 md:p-12 lg:p-16"
            >
                <div className="mb-8 lg:mb-12 max-w-[1800px] mx-auto">
                    <Link href="/interiors" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                        ← Back to Projects
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-10 lg:gap-16 max-w-[1800px] mx-auto items-stretch">
                    <div className="w-full md:w-[35%] flex flex-col shrink-0 justify-between">
                        <div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-none tracking-tight mb-6 lg:mb-8 text-zinc-800">
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
                        </div>

                        <div className="mt-12 lg:mt-16 uppercase text-xs md:text-sm tracking-widest text-zinc-400">
                            <h3 className="font-bold text-zinc-800 mb-4 lg:mb-6">PROJECT INFORMATION</h3>

                            <div className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-2 lg:gap-y-3 font-light">
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

                    <div className="w-full md:w-[65%] min-h-[400px]">
                        {project.coverPhoto && (
                            <img
                                src={project.coverPhoto}
                                alt={`${project.title} Cover`}
                                className="w-full h-full object-cover bg-zinc-50"
                            />
                        )}
                    </div>
                </div>

                {isMounted && shuffledImages.length > 0 && (
                    <div className="mt-16 md:mt-24 max-w-[1800px] mx-auto">
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
                            {shuffledImages.map((imgSrc: string, i: number) => (
                                <GalleryImage
                                    key={i}
                                    src={imgSrc}
                                    alt={`${project.title} Gallery Image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </motion.main>
        </div>
    );
}