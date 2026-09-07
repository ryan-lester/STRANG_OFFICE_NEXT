"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InteriorsListClient({ projects }: { projects: any[] }) {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen w-full bg-white text-black p-6 md:p-12 lg:p-16"
            style={{ fontFamily: '"Neue Haas Grotesk Display Pro", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
            {/* Forced 3-Column Grid on medium screens and up */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12 w-full max-w-[1600px] mx-auto">
                {projects.map((project, index) => (
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
                            {/* Image Container - Matches the ~3:2 landscape ratio of the screenshot */}
                            <div className="relative w-full aspect-[1.45/1] overflow-hidden mb-3 bg-zinc-100">
                                {project.coverPhoto && (
                                    <img
                                        src={project.coverPhoto}
                                        alt={`${project.title} Cover`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                )}
                            </div>

                            {/* Title - Positioned tight below the image, left-aligned, standard bold casing */}
                            <div className="text-left">
                                <h2 className="text-sm md:text-base font-bold text-black m-0 leading-snug">
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