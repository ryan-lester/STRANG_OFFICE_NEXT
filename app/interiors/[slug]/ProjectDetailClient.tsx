"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';

/*
    Body copy measured from strang.design: Untitled Sans, 16px,
    1.3 line height (20.8px), no extra letter spacing.
    Paragraph gap = one line of text.
*/
const BODY_STYLE = {
    fontFamily: '"UntitledSans", sans-serif',
    fontSize: '16px',
    lineHeight: 1.3,
    letterSpacing: 'normal',
};

/*
    Paragraphs from Sanity, shown exactly as typed there:
    - Each paragraph (Enter in Sanity) is its own block, with one line of
      space between paragraphs (the gap on the wrapper below).
    - Line breaks inside a paragraph (Shift+Enter in Sanity) are kept,
      thanks to whitespace-pre-line on the wrapper.
    - Empty paragraphs (Enter pressed twice in Sanity) are skipped, so the
      space between paragraphs is always exactly one line.
*/
const isEmptyBlock = (value: any) =>
    !value?.children?.some((child: any) => typeof child?.text === 'string' && child.text.trim() !== '');

const portableTextComponents = {
    block: {
        normal: ({ children, value }: any) =>
            isEmptyBlock(value) ? null : <p className="m-0">{children}</p>,
    },
};

// Space between paragraphs = one line of text (set inline so it always applies)
const PARAGRAPH_WRAPPER_STYLE = { display: 'flex', flexDirection: 'column' as const, gap: '1.3em' };

function Description({ value }: { value: any }) {
    if (!value) return null;

    // Plain-text field: split on blank lines into paragraphs
    if (typeof value === 'string') {
        return (
            <div className="whitespace-pre-line" style={PARAGRAPH_WRAPPER_STYLE}>
                {value
                    .split(/\n\s*\n/)
                    .filter((para) => para.trim() !== '')
                    .map((para, i) => (
                        <p key={i} className="m-0">{para.trim()}</p>
                    ))}
            </div>
        );
    }

    // Rich text (Portable Text) field
    return (
        <div className="whitespace-pre-line" style={PARAGRAPH_WRAPPER_STYLE}>
            <PortableText value={value} components={portableTextComponents} />
        </div>
    );
}

type GalleryImg = { url: string; aspectRatio?: number };

/* ------------------------------------------------------------------
   Justified gallery — NO CROPPING.
   Each row is filled edge to edge by scaling its images to one shared
   height, so every row is flush on both sides and the gallery ends on
   a straight bottom edge. Images are only resized, never trimmed.

   Rows are chosen with a small optimizer so every row (including the
   last) lands close to the target height — no stray tall last row.
------------------------------------------------------------------- */
function partitionRows(ratios: number[], width: number, target: number, gap: number, maxPerRow: number) {
    const n = ratios.length;
    const best = new Array(n + 1).fill(Infinity);
    const prev = new Array(n + 1).fill(0);
    best[0] = 0;

    for (let j = 1; j <= n; j++) {
        let sum = 0;
        for (let k = 1; k <= maxPerRow && j - k >= 0; k++) {
            const i = j - k;
            sum += ratios[i];
            const h = (width - gap * (k - 1)) / sum;
            const cost = ((h - target) / target) ** 2;
            if (best[i] + cost < best[j]) {
                best[j] = best[i] + cost;
                prev[j] = i;
            }
        }
    }

    const rows: [number, number][] = [];
    for (let j = n; j > 0; j = prev[j]) rows.unshift([prev[j], j]);
    return rows;
}

function GalleryImage({ img, alt }: { img: GalleryImg; alt: string }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const ratio = img.aspectRatio || 1.5;

    return (
        /*
            flex-grow = aspect ratio + matching aspect-ratio box:
            the row's width is shared in proportion to each image's shape,
            so all images in the row end up exactly the same height.
        */
        <div
            className={`relative min-w-0 ${isLoaded ? '' : 'bg-zinc-200'}`}
            style={{ flex: `${ratio} 1 0%`, aspectRatio: `${ratio}` }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-[3px] border-zinc-300 border-t-black rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={img.url}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className={`block w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
            />
        </div>
    );
}

function JustifiedGallery({ images, title }: { images: GalleryImg[]; title: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Spacing and row height scale with the screen, like the main site
    const gap = width >= 900 ? 20 : 16;
    const target = width >= 1250 ? 440 : width >= 900 ? 340 : 260;
    const isMobile = width > 0 && width < 640;

    const rows = useMemo(() => {
        if (!width) return [];
        // On phones, one image per row at full width (natural proportions)
        if (isMobile) return images.map((_, i) => [i, i + 1] as [number, number]);
        const ratios = images.map((img) => img.aspectRatio || 1.5);
        return partitionRows(ratios, width, target, gap, 4);
    }, [images, width, target, gap, isMobile]);

    return (
        <div ref={containerRef} className="w-full flex flex-col" style={{ gap }}>
            {rows.map(([start, end]) => (
                <div key={start} className="flex w-full" style={{ gap }}>
                    {images.slice(start, end).map((img, n) => (
                        <GalleryImage
                            key={img.url + (start + n)}
                            img={img}
                            alt={`${title} Gallery Image ${start + n + 1}`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default function ProjectDetailClient({ project }: { project: any }) {
    const [shuffledImages, setShuffledImages] = useState<GalleryImg[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (project?.images && project.images.length > 0) {
            const array: GalleryImg[] = project.images.filter((img: GalleryImg) => img?.url);
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            setShuffledImages(array);
        }
    }, [project?.images]);

    if (!project) return null;

    return (
        /*
            Static background lives on a non-animating wrapper so nothing
            bleeds through while the motion div is at opacity 0.
            Font + letter-spacing match strang.design's .font-title class.
        */
        <div
            className="min-h-screen w-full bg-[#f1f1f1] text-black"
            style={{ fontFamily: '"D-DINCondensed", sans-serif', letterSpacing: '0.3px' }}
        >
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 md:p-12 lg:p-16"
            >
                <div className="mb-8 lg:mb-12 max-w-[1800px] mx-auto">
                    <Link href="/interiors" className="text-lg uppercase text-[#828282] hover:text-black transition-colors">
                        ← Back to Projects
                    </Link>
                </div>

                {/*
                    Fixed layout — identical on every project:
                    text column 35% on the left, cover photo 65% on the right,
                    both starting at the same top line. The photo always has the
                    same shape, so it's the same size on every page; the text
                    simply runs as long as it needs to.
                */}
                <div className="flex flex-col md:flex-row gap-10 lg:gap-16 max-w-[1800px] mx-auto items-start">
                    <div className="w-full md:w-[35%] flex flex-col shrink-0">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal uppercase leading-none mb-6 lg:mb-8 text-black">
                            {project.title}
                        </h1>

                        <div className="text-black font-normal max-w-none" style={BODY_STYLE}>
                            <Description value={project.description} />
                        </div>

                        <div className="mt-12 lg:mt-16 uppercase text-base md:text-lg text-black">
                            <h3 className="font-normal mb-4 lg:mb-6">Project Information</h3>

                            <div className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-0.5 font-normal">
                                {project.location && (
                                    <>
                                        <span className="text-[#828282]">Location</span>
                                        <span>{project.location}</span>
                                    </>
                                )}
                                {project.dateCompleted && (
                                    <>
                                        <span className="text-[#828282]">Date Completed</span>
                                        <span>{project.dateCompleted}</span>
                                    </>
                                )}
                                {project.squareFootage && (
                                    <>
                                        <span className="text-[#828282]">Square Footage</span>
                                        <span>{project.squareFootage}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cover photo — fixed 3:2 frame, cropped to fill if the
                        photo is a different shape. Change aspect-[3/2] to adjust. */}
                    <div className="w-full md:w-[65%] aspect-[3/2] overflow-hidden bg-zinc-200">
                        {project.coverPhoto && (
                            <img
                                src={project.coverPhoto}
                                alt={`${project.title} Cover`}
                                className="block w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                {isMounted && shuffledImages.length > 0 && (
                    /* Space above the gallery matches the page's outer padding,
                       and nothing is added under the last row, so the bottom
                       edge mirrors the top. */
                    <div className="mt-6 md:mt-12 lg:mt-16 max-w-[1800px] mx-auto">
                        <JustifiedGallery images={shuffledImages} title={project.title} />
                    </div>
                )}
            </motion.main>
        </div>
    );
}