"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InteriorsListClient({ projects }: { projects: any[] }) {
    // Sort projects alphabetically by title
    const sortedProjects = [...projects].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
    );

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen w-full bg-white text-black p-6 md:p-12 lg:p-16"
            style={{ fontFamily: '"DIN Pro Condensed", "DIN Alternate", sans-serif' }}
        >
            {/* Logo Space - Increased to 70% width */}
            <div className="w-[70%] mx-auto mb-10 md:mb-16 flex justify-center">
                <img
                    src="/strang_logo/strang_logo.png"
                    alt="Brand Logo"
                    className="w-full h-auto object-contain"
                />
            </div>

            {/* Department Title - Centered and slightly scaled down */}
            <div className="w-full max-w-[1400px] mx-auto text-center mb-10 md:mb-16">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal uppercase tracking-wide text-black m-0">
                    INTERIOR DESIGN
                </h1>
            </div>

            {/* Dense Inline Project Navigation List */}
            <div className="w-full max-w-[1400px] mx-auto mb-12 md:mb-16 text-left">
                <div className="flex flex-wrap gap-x-4 md:gap-x-5 gap-y-2 md:gap-y-3 leading-tight items-center justify-center md:justify-start">
                    {sortedProjects.map((project) => (
                        <Link
                            key={`nav-${project._id}`}
                            href={`/interiors/${project.slug?.current}`}
                            className="text-xs md:text-sm font-normal text-black hover:text-zinc-500 transition-colors uppercase tracking-wider"
                            /* Explicitly forcing the font here so Next.js/Browser link resets don't override it */
                            style={{ fontFamily: '"DIN Pro Condensed", "DIN Alternate", sans-serif' }}
                        >
                            {project.title}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Balanced 1400px grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-16 lg:gap-y-20 w-full max-w-[1400px] mx-auto">
                {sortedProjects.map((project, index) => (
                    <Link
                        key={project._id}
                        href={`/interiors/${project.slug?.current}`}
                        className="group block cursor-pointer"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="flex flex-col w-full"
                        >
                            {/* Image Container */}
                            <div className="relative w-full aspect-[1.45/1] overflow-hidden mb-2 bg-zinc-100">
                                {project.coverPhoto && (
                                    <img
                                        src={project.coverPhoto}
                                        alt={`${project.title} Cover`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                )}
                            </div>

                            {/* Title */}
                            <div className="text-left mt-1">
                                <h2 className="text-sm md:text-base font-normal text-black m-0 leading-none uppercase tracking-wide">
                                    {project.title}
                                </h2>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.main>
    );
}