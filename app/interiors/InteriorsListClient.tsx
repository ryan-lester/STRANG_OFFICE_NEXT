"use client";

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// useLayoutEffect in the browser (no flicker), useEffect on the server (no warning)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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

/* ------------------------------------------------------------------
   Project name list — centered block, left-aligned names.
   CSS alone can't shrink a wrapping row to its longest line, so this
   measures each name, works out where the lines will break, and sets
   the list's width to exactly the longest line. Centering that width
   makes the space on the right equal to the space on the left.
------------------------------------------------------------------- */
function ProjectNameList({ projects }: { projects: any[] }) {
    const outerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [fitWidth, setFitWidth] = useState<number | null>(null);

    useIsoLayoutEffect(() => {
        const outer = outerRef.current;
        const list = listRef.current;
        if (!outer || !list) return;

        const measure = () => {
            const available = outer.clientWidth;
            const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
            let line = 0;
            let widest = 0;
            for (const el of Array.from(list.children) as HTMLElement[]) {
                const w = el.getBoundingClientRect().width;
                if (line > 0 && line + gap + w > available) {
                    // This name wraps to a new line
                    widest = Math.max(widest, line);
                    line = w;
                } else {
                    line = line > 0 ? line + gap + w : w;
                }
            }
            widest = Math.max(widest, line);
            // +1px guards against sub-pixel rounding causing an extra wrap
            setFitWidth(Math.min(available, Math.ceil(widest) + 1));
        };

        measure();

        // Re-measure when the page resizes or the web font finishes loading
        const ro = new ResizeObserver(measure);
        ro.observe(outer);
        Array.from(list.children).forEach((el) => ro.observe(el as Element));
        let active = true;
        document.fonts?.ready.then(() => active && measure());

        return () => {
            active = false;
            ro.disconnect();
        };
    }, [projects]);

    return (
        /* Same insets as the main site */
        <div className="md:px-8 xl:px-12">
            <div ref={outerRef}>
                <div
                    ref={listRef}
                    className="mx-auto flex flex-wrap gap-x-4 gap-y-1"
                    style={fitWidth ? { width: fitWidth } : undefined}
                >
                    {projects.map((project) => (
                        <Link
                            key={`nav-${project._id}`}
                            href={`/interiors/${project.slug?.current}`}
                            className="shrink-0 text-base leading-6 font-normal text-black hover:text-[#828282] transition-colors uppercase"
                            /* Explicitly forcing the font so link resets don't override it */
                            style={DIN_STYLE}
                        >
                            {project.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function InteriorsListClient({ projects }: { projects: any[] }) {
    /*
        Sort projects alphabetically by title, the way they read on screen.
        Titles are cleaned up first so invisible differences in the CMS
        (extra or non-breaking spaces, dashes, curly quotes, upper vs lower
        case) can't push one title out of order. Numbers sort naturally,
        so "Residence 2" comes before "Residence 10".
    */
    const sortKey = (title?: string) =>
        (title || "")
            .normalize("NFKC")
            .replace(/[^\p{L}\p{N}]+/gu, " ") // punctuation and odd spaces → one plain space
            .trim()
            .toLowerCase();

    const sortedProjects = [...(projects ?? [])].sort((a, b) =>
        sortKey(a.title).localeCompare(sortKey(b.title), "en", { numeric: true, sensitivity: "base" })
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
                    {/* Project name list — centered, left-aligned, equal space on both sides */}
                    <ProjectNameList projects={sortedProjects} />

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