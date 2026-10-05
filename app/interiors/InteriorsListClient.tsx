"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

// Matches strang.design's .font-title class
const DIN_STYLE = { fontFamily: '"D-DINCondensed", sans-serif', letterSpacing: '0.3px' };

/*
    Layout values copied from strang.design's stylesheet:
    - Logo: full width with 32px / 64px side padding, then 70vw from 1024px up, 96px from the top
    - Content wrapper: max 1600px wide, centered, 32px side padding below 1650px
    - Project name list: inset 32px (≥768px) / 48px (≥1280px), 16px between names, 4px between lines
    - Image grid: inset 1.33rem
*/
const pageStyles = `
.strang-wrapper { max-width: 1600px; margin: 0 auto; }
@media (max-width: 1650px) { .strang-wrapper { padding: 0 2rem; } }
`;

export default function InteriorsListClient({ projects }: { projects: any[] }) {
    // Sort projects alphabetically by title
    const sortedProjects = [...projects].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
    );

    return (
        /*
            The background lives on this non-animating wrapper, so nothing
            dark can show through while the content fades in.
        */
        <div className="min-h-screen w-full bg-[#f1f1f1] text-black" style={DIN_STYLE}>
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full pb-16"
            >
                {/* Logo — same size and top spacing as the main site */}
                <header className="w-full flex flex-col items-center">
                    <Link href="/" className="block">
                        <img
                            src="/strang_logo/strang_logo.png"
                            alt="Strang logo"
                            className="w-screen px-8 md:px-16 lg:px-0 lg:w-[70vw] h-auto mt-24"
                        />
                    </Link>

                    {/* Equal space above and below, so the title sits centered
                        between the logo and the project list */}
                    <h1 className="my-10 md:my-12 lg:my-16 text-3xl md:text-4xl lg:text-5xl font-normal uppercase text-black text-center leading-none">
                        Interior Design
                    </h1>
                </header>

                <section className="strang-wrapper flex flex-col gap-10 md:gap-16 lg:gap-20">
                    {/* Project name list — same insets and spacing as the main site */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 md:px-8 xl:px-12">
                        {sortedProjects.map((project) => (
                            <Link
                                key={`nav-${project._id}`}
                                href={`/interiors/${project.slug?.current}`}
                                className="text-lg leading-7 font-normal text-black hover:text-[#828282] transition-colors uppercase"
                                /* Explicitly forcing the font so link resets don't override it */
                                style={DIN_STYLE}
                            >
                                {project.title}
                            </Link>
                        ))}
                    </div>

                    {/* Image grid — inset 1.33rem like the main site's gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[1.33rem] gap-y-12 lg:gap-y-16 px-0 md:px-[1.33rem]">
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
                                    <div className="relative w-full aspect-[1.45/1] overflow-hidden mb-2 bg-zinc-200">
                                        {project.coverPhoto && (
                                            <img
                                                src={project.coverPhoto}
                                                alt={`${project.title} Cover`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                            />
                                        )}
                                    </div>

                                    <h2 className="text-lg leading-7 font-normal text-black m-0 uppercase">
                                        {project.title}
                                    </h2>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>
            </motion.main>
        </div>
    );
}