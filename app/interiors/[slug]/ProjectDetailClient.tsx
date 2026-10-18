"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* ==================================================================
   STRANG — Home page
   Sections:
     1. Header  — logo top-left, nav top-right, black hover bar
     2. Hero    — 16:9, one project at a time (photo or video)
     3. Statement
     4. Project slider — one row, swipeable, arrow button on the right
     5. Collage — manually curated content (edit COLLAGE_ITEMS below)
   Fonts, sizes, colors and insets match the interiors pages.
================================================================== */

const DIN_STYLE = { fontFamily: '"D-DINCondensed", sans-serif', letterSpacing: '0.3px' };
const BODY_STYLE = { fontFamily: '"UntitledSans", sans-serif' };
const GRAY = '#828282';

const pageStyles = `
.strang-wrapper { max-width: 1600px; margin: 0 auto; }
@media (max-width: 1650px) { .strang-wrapper { padding: 0 2rem; } }

.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

/* Collage: stacked on phones, placed on a 12-column grid from 768px */
.collage-grid { display: grid; grid-template-columns: 1fr; gap: 1.33rem; }
.collage-item { aspect-ratio: var(--m-aspect, 4 / 3); }
@media (min-width: 768px) {
    .collage-grid {
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-auto-rows: clamp(40px, 5.5vw, 92px);
    }
    .collage-item { aspect-ratio: auto; grid-column: var(--col); grid-row: var(--row); }
}
`;

/* ------------------------------------------------------------------
   NAV — add/remove items or sub-items here.
   Items with `children` open the black bar on hover.
------------------------------------------------------------------- */
type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

const NAV: NavItem[] = [
    {
        label: 'Profile',
        href: '/profile',
        children: [
            { label: 'Team', href: '/profile#team' },
            { label: 'Services', href: '/profile#services' },
            { label: 'Accolades', href: '/profile#accolades' },
            { label: 'Deep Dive', href: '/profile#deep-dive' },
            { label: 'Press', href: '/profile#press' },
        ],
    },
    {
        label: 'Projects',
        href: '/projects',
        children: [
            { label: 'Architecture', href: '/projects' },
            { label: 'Interiors', href: '/interiors' },
        ],
    },
    { label: 'Contact', href: '/contact' },
];

/* ------------------------------------------------------------------
   STATEMENT
------------------------------------------------------------------- */
const STATEMENT = [
    'For over twenty-five years, STRANG has specialized in the design of exquisite homes shaped by climate, landscape and individual lifestyles. With an extensive portfolio of completed projects throughout Florida and beyond, the firm is recognized not only for its design excellence, but also for its proven track record of guiding complex projects from concept through execution with a high level of certainty and discipline.',
    'STRANG-designed residences have consistently achieved exceptional market performance and record-setting sales, reflecting the enduring quality, desirability and long-term value of the work. Our approach combines refined modern design with decades of real-world experience — creating homes that are both architecturally significant and exceptionally livable.',
];

/* ------------------------------------------------------------------
   COLLAGE — edit freely.
   col / row use CSS grid line syntax on a 12-column grid
   (each row unit is ~5.5vw, max 92px). `mAspect` sets the shape
   on phones, where items simply stack.
------------------------------------------------------------------- */
type CollageItem =
    | { type: 'image'; src: string; alt?: string; href?: string; caption?: string; col: string; row: string; mAspect?: string }
    | { type: 'video'; src: string; poster?: string; href?: string; caption?: string; col: string; row: string; mAspect?: string }
    | { type: 'text'; text: string; attribution?: string; col: string; row: string; mAspect?: string };

const COLLAGE_ITEMS: CollageItem[] = [
    { type: 'image', src: '/collage/01.jpg', caption: 'Coconut Grove Residence', col: '1 / span 7', row: '1 / span 6', mAspect: '4 / 3' },
    { type: 'image', src: '/collage/02.jpg', col: '8 / span 5', row: '1 / span 4', mAspect: '5 / 4' },
    { type: 'text', text: 'Architecture shaped by climate, landscape and the way people actually live.', col: '8 / span 5', row: '5 / span 2', mAspect: 'auto' },
    { type: 'video', src: '/collage/03.mp4', poster: '/collage/03.jpg', col: '1 / span 4', row: '7 / span 5', mAspect: '4 / 5' },
    { type: 'image', src: '/collage/04.jpg', caption: 'Detail — Stair', col: '5 / span 4', row: '7 / span 3', mAspect: '4 / 3' },
    { type: 'image', src: '/collage/05.jpg', col: '9 / span 4', row: '7 / span 7', mAspect: '3 / 4' },
    { type: 'image', src: '/collage/06.jpg', col: '5 / span 4', row: '10 / span 4', mAspect: '1 / 1' },
];

/* ================================================================== */

function SiteHeader() {
    const headerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLAnchorElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [open, setOpen] = useState<number | null>(null);
    const [bar, setBar] = useState({ left: 0, width: 0 });

    // Bar runs from just right of the logo to just past the hovered item,
    // with the same padding on both ends (like the original site).
    const BAR_PAD = 36;

    const openItem = (i: number) => {
        if (!NAV[i].children?.length || window.innerWidth < 1024) {
            setOpen(null);
            return;
        }
        const h = headerRef.current?.getBoundingClientRect();
        const l = logoRef.current?.getBoundingClientRect();
        const it = itemRefs.current[i]?.getBoundingClientRect();
        if (!h || !l || !it) return;
        const left = l.right - h.left + BAR_PAD;
        const right = it.right - h.left + BAR_PAD;
        setBar({ left, width: right - left });
        setOpen(i);
    };

    useEffect(() => {
        const close = () => setOpen(null);
        window.addEventListener('resize', close);
        return () => window.removeEventListener('resize', close);
    }, []);

    const active = open !== null ? NAV[open] : null;

    return (
        <header className="absolute top-0 inset-x-0 z-50">
            {/* Soft gradient so white type reads on any photo */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />

            <div
                ref={headerRef}
                onMouseLeave={() => setOpen(null)}
                className="relative flex items-center justify-between px-8 md:px-16 pt-8 lg:pt-10"
            >
                <Link ref={logoRef} href="/" className="relative z-10 block shrink-0">
                    <img
                        src="/strang_logo/strang_logo.png"
                        alt="Strang logo"
                        className="h-6 md:h-8 w-auto brightness-0 invert"
                    />
                </Link>

                {/* Black hover bar */}
                <AnimatePresence>
                    {active && (
                        <motion.div
                            key={active.label}
                            initial={{ opacity: 0, scaleX: 0.96 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            style={{ left: bar.left, width: bar.width, transformOrigin: 'right center' }}
                            className="absolute bottom-0 h-10 -mb-[2px] bg-black flex items-center"
                        >
                            <div className="flex items-center gap-x-16 xl:gap-x-[4.5rem]" style={{ paddingLeft: BAR_PAD }}>
                                {active.children!.map((c) => (
                                    <Link
                                        key={c.href + c.label}
                                        href={c.href}
                                        className="text-lg leading-7 uppercase text-[#828282] hover:text-white transition-colors whitespace-nowrap"
                                        style={DIN_STYLE}
                                    >
                                        {c.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <nav className="relative z-10 flex items-center h-10 gap-x-8 md:gap-x-16 xl:gap-x-[4.5rem]">
                    {NAV.map((item, i) => (
                        <Link
                            key={item.label}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            href={item.href}
                            onMouseEnter={() => openItem(i)}
                            onFocus={() => openItem(i)}
                            className="text-lg leading-7 uppercase text-white transition-colors"
                            style={DIN_STYLE}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}

/* ------------------------------------------------------------------
   HERO — one project at a time. Uses project.heroVideo if present,
   otherwise project.coverPhoto. Images hold 6s; videos play through.
------------------------------------------------------------------- */
type Slide = { type: 'image' | 'video'; src: string; poster?: string; title: string; href: string };

function Hero({ slides }: { slides: Slide[] }) {
    const [index, setIndex] = useState(0);
    const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
    const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

    const current = slides[index];

    useEffect(() => {
        if (!current || current.type === 'video' || slides.length < 2) return;
        const t = setTimeout(next, 6000);
        return () => clearTimeout(t);
    }, [current, next, slides.length]);

    if (!current) return <div className="w-full aspect-video bg-zinc-300" />;

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <section className="relative w-full aspect-video overflow-hidden bg-black">
            <AnimatePresence initial={false}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    {current.type === 'video' ? (
                        <video
                            src={current.src}
                            poster={current.poster}
                            autoPlay
                            muted
                            playsInline
                            onEnded={slides.length > 1 ? next : undefined}
                            loop={slides.length < 2}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img src={current.src} alt={current.title} className="w-full h-full object-cover" />
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-8 md:px-16 pb-6 md:pb-10 text-white" style={DIN_STYLE}>
                <Link href={current.href} className="text-lg leading-7 uppercase hover:text-[#cfcfcf] transition-colors">
                    {current.title}
                </Link>

                {slides.length > 1 && (
                    <div className="flex items-center gap-6 text-lg leading-7 uppercase">
                        <button onClick={prev} aria-label="Previous project" className="hover:text-[#cfcfcf] transition-colors">←</button>
                        <span className="tabular-nums">{pad(index + 1)} / {pad(slides.length)}</span>
                        <button onClick={next} aria-label="Next project" className="hover:text-[#cfcfcf] transition-colors">→</button>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------
   PROJECT SLIDER — one row. Swipe / trackpad scroll, or the arrow
   button on the right (wraps back to the start at the end).
------------------------------------------------------------------- */
function ProjectSlider({ projects }: { projects: any[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const firstImgRef = useRef<HTMLDivElement>(null);
    const [imgH, setImgH] = useState(0);
    const [atEnd, setAtEnd] = useState(false);

    // Keep the arrow centered on the image row, whatever the screen size
    useEffect(() => {
        const el = firstImgRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([e]) => setImgH(e.contentRect.height));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const onScroll = () => {
        const el = trackRef.current;
        if (!el) return;
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };

    const advance = () => {
        const el = trackRef.current;
        if (!el) return;
        if (atEnd) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }
        const card = el.querySelector<HTMLElement>('[data-card]');
        const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
        el.scrollBy({ left: card ? card.offsetWidth + gap : el.clientWidth, behavior: 'smooth' });
    };

    return (
        <div className="relative md:px-[1.33rem]">
            <div
                ref={trackRef}
                onScroll={onScroll}
                className="no-scrollbar flex gap-x-[1.33rem] overflow-x-auto snap-x snap-mandatory scroll-smooth"
            >
                {projects.map((project, i) => (
                    <Link
                        key={project._id}
                        data-card
                        href={`/interiors/${project.slug?.current}`}
                        className="group block shrink-0 snap-start w-[85%] sm:w-[calc((100%-1.33rem)/2)] md:w-[calc((100%-2*1.33rem)/3)]"
                    >
                        <div
                            ref={i === 0 ? firstImgRef : undefined}
                            className="relative w-full aspect-[1.45/1] overflow-hidden mb-2 bg-zinc-200"
                        >
                            {project.coverPhoto && (
                                <img
                                    src={project.coverPhoto}
                                    alt={`${project.title} Cover`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                            )}
                        </div>
                        <h3 className="text-lg leading-7 font-normal text-black m-0 uppercase">{project.title}</h3>
                    </Link>
                ))}
            </div>

            {projects.length > 1 && (
                <button
                    onClick={advance}
                    aria-label={atEnd ? 'Back to first project' : 'Next projects'}
                    style={{ top: imgH ? imgH / 2 : '35%', ...DIN_STYLE }}
                    className="hidden sm:flex absolute right-0 md:right-[1.33rem] -translate-y-1/2 h-12 w-12 items-center justify-center bg-black text-white text-xl hover:bg-[#333] transition-colors"
                >
                    {atEnd ? '↺' : '→'}
                </button>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------
   COLLAGE
------------------------------------------------------------------- */
function Collage({ items }: { items: CollageItem[] }) {
    return (
        <div className="collage-grid md:px-[1.33rem]">
            {items.map((item, i) => {
                const style = { '--col': item.col, '--row': item.row, '--m-aspect': item.mAspect ?? '4 / 3' } as React.CSSProperties;

                if (item.type === 'text') {
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.8 }}
                            className="collage-item flex flex-col justify-end py-4 md:py-0"
                            style={style}
                        >
                            <p className="text-2xl md:text-3xl lg:text-4xl uppercase leading-none text-black" style={DIN_STYLE}>
                                {item.text}
                            </p>
                            {item.attribution && (
                                <span className="mt-3 text-lg leading-7 uppercase text-[#828282]" style={DIN_STYLE}>
                                    {item.attribution}
                                </span>
                            )}
                        </motion.div>
                    );
                }

                const media =
                    item.type === 'video' ? (
                        <video src={item.src} poster={item.poster} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                        <img
                            src={item.src}
                            alt={item.alt ?? item.caption ?? ''}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    );

                const inner = (
                    <>
                        <div className="relative w-full h-full overflow-hidden bg-zinc-200">{media}</div>
                        {item.caption && (
                            <span className="absolute left-0 -bottom-8 text-lg leading-7 uppercase text-black hidden md:block" style={DIN_STYLE}>
                                {item.caption}
                            </span>
                        )}
                    </>
                );

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, delay: (i % 3) * 0.08 }}
                        className="collage-item relative group"
                        style={style}
                    >
                        {item.href ? (
                            <Link href={item.href} className="block w-full h-full">{inner}</Link>
                        ) : (
                            inner
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ================================================================== */

export default function PrototypeHomepageClient({ projects }: { projects: any[] }) {
    const sortedProjects = [...projects].sort((a, b) => (a.title || '').localeCompare(b.title || ''));

    const heroSlides: Slide[] = sortedProjects
        .filter((p) => p.heroVideo || p.coverPhoto)
        .map((p) => ({
            type: p.heroVideo ? 'video' : 'image',
            src: p.heroVideo || p.coverPhoto,
            poster: p.coverPhoto,
            title: p.title,
            href: `/interiors/${p.slug?.current}`,
        }));

    return (
        <div className="min-h-screen w-full bg-[#f1f1f1] text-black" style={DIN_STYLE}>
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative w-full pb-24"
            >
                <SiteHeader />
                <Hero slides={heroSlides} />

                {/* Statement */}
                <section className="strang-wrapper py-20 md:py-28 lg:py-36">
                    <div className="max-w-[880px] mx-auto text-black text-lg leading-[1.75rem] font-normal" style={BODY_STYLE}>
                        {STATEMENT.map((p, i) => (
                            <p key={i} className="mb-5 last:mb-0">{p}</p>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section className="strang-wrapper">
                    <div className="flex items-baseline justify-between mb-6 md:mb-8 md:px-[1.33rem]">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal uppercase leading-none">Projects</h2>
                        <Link href="/interiors" className="text-lg leading-7 uppercase text-[#828282] hover:text-black transition-colors">
                            View All
                        </Link>
                    </div>
                    <ProjectSlider projects={sortedProjects} />
                </section>

                {/* Collage */}
                <section className="strang-wrapper mt-24 md:mt-32 lg:mt-40 pb-8">
                    <Collage items={COLLAGE_ITEMS} />
                </section>
            </motion.main>
        </div>
    );
}