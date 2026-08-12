"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, animate } from 'framer-motion';

// Upgraded fake project data with real architectural photography from Unsplash
const PROJECTS = [
    {
        id: 1,
        title: "ANDROS SHOWROOM",
        description: "The Andros Showroom explores the intersection of residential design and luxury retail through a curated sequence of interior environments that celebrate furniture, lighting, and accessories within fully realized living spaces. \n\nA restrained palette of natural materials, warm wood, stone, and layered textures establishes a timeless architectural language, while custom millwork and integrated lighting enhance the presentation of each collection. \n\nThe result is an immersive showroom experience that reflects the Andros Home brand and its commitment to craftsmanship, quality, and enduring design.",
        location: "LAKE PARK, FL",
        date: "2025",
        sqft: "5,000 SF",
        coverPhoto: "https://www.strang.design/resources/ARCHITECTURESARASOTA_STRANG_VANDERVLUGT_PHOTOS_RYAN_LESTER-43.jpg",
        images: [
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_1578-Enhanced-NR-Edit_4K.jpg",
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_0499-Enhanced-NR-Edit_4K-Copy_2026-01-09-175750_ysaj.jpg",
            "https://www.strang.design/resources/ARCHITECTURESARASOTA_STRANG_VANDERVLUGT_PHOTOS_RYAN_LESTER-43.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-32-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-45-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-25-LY-240712.jpg",
        ]
    },
    {
        id: 2,
        title: "ANGEL OAKS",
        description: "Angel Oaks is is organized around a centralized courtyard which remains open towards the landscape beyond. The courtyard contains a linear pool and accompanying terrace. Two distinctive wings are connected by a two-story bridge above the main living room. Approaching the house, you’re greeted by large walls of split-face keystone that move their way into the house. \n\nThe implementation of keystone and wood on both the interior and exterior creates a seamless effect. A daring span creates the perfect condition for an “outdoor living” space situated around the pool. Wooden louvers pick up material cues from the interior and create privacy for the four bedrooms and family room. Minimal and modern, the home offers a bold design to complement its sleek landscaping and surrounding garden.",
        location: "MIAMI, FL",
        date: "2021",
        sqft: "10,000 SF",
        coverPhoto: "https://www.strang.design/resources/DSC4958-LY-240712.jpg",
        images: [
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_1578-Enhanced-NR-Edit_4K.jpg",
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_0499-Enhanced-NR-Edit_4K-Copy_2026-01-09-175750_ysaj.jpg",
            "https://www.strang.design/resources/ARCHITECTURESARASOTA_STRANG_VANDERVLUGT_PHOTOS_RYAN_LESTER-43.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-32-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-45-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-25-LY-240712.jpg",
        ]
    },
    {
        id: 3,
        title: "BALLAST TRAIL RESIDENCE",
        description: "Designed as a beach house in the Florida Keys, the Ballast Trail Resi¬dence defies an easy description. Strang has subtly blended vernacular elements such as pitched metal roofs and wood porches with mod¬ern elements such as glass bridges and stark stone walls to manifest a distinct architectural vision. As such, the house taps into a certain ‘regionalism of liberation’ in which architecture is viewed as an evolv¬ing tradition that accepts new ideas and transforms them by adapting them to local characteristics. The Ballast Trail Residence imaginatively expresses this fusion of the old and the new. In fact, the design goes beyond a simple response to the climate and site. It goes further by offering an evolutionary design which creatively celebrates the cultural, ecological and physical environment of The Florida Keys. \n\nLocated on the shores of Key Largo, the house is positioned where a tropical hardwood hammock meets the Atlantic Ocean. The bedrock of the island is a fossilized coral reef, which also serves as the primary cladding material for the home. Immense walls of Florida ‘keystone’ become the organizing elements of the overall design. An entry breeze¬way, punctuated with a louvered-glass bridge, separates the home’s two distinctive wings.\n",
        location: "THE FLORIDA KEYS",
        date: "2016",
        sqft: "5,200 SF",
        coverPhoto: "https://www.strang.design/resources/STRANG_ROCKPINE_1405-Enhanced-NR-HDR-Edit_4K-LY-240711.jpg",
        images: [
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_1578-Enhanced-NR-Edit_4K.jpg",
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_0499-Enhanced-NR-Edit_4K-Copy_2026-01-09-175750_ysaj.jpg",
            "https://www.strang.design/resources/ARCHITECTURESARASOTA_STRANG_VANDERVLUGT_PHOTOS_RYAN_LESTER-43.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-32-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-45-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-25-LY-240712.jpg",
        ]
    },
    {
        id: 4,
        title: "CARILLON APARTMENT",
        description: "Comingling the inherent polarities of historic with modern, hard with plush, and personality with function all at the height of an existing 27th floor in North Miami Beach, FL resulted in an inspiring renovation project. Interpreted through the senses, interplayed between varying elements, and highlighted for those with detailed attention, we’ve joined intriguing materials with elevated aesthetics to unleash the spirit of this 6-bedroom/6-bathroom oceanfront lair. Attention to detail was a priority with the design containing so many interactions between materials.\n\nEach space has its own personality while maintaining flow and cohesion. Inspired by a skillful game of “pick up sticks,” we mixed broken Carrara marble slabs with terrazzo while incorporating brass strip inlays that extended from the floor up to the walls. Custom brass panels divide and decorate the flow between the Library and Living Room while brass inlay flows throughout shared spaces to maintain cohesive design style and mood. There is an interplay between natural materials and soft textures and fabrics that boast cool hues of different blues, colors that complement the incredible views of the ocean from main Living areas. To maintain a relationship with the historic aesthetic of the neighborhood the interior design marries the vintage elements with modern principles.\n",
        location: "MIAMI BEACH, FL",
        date: "2019",
        sqft: "5,100 SF",
        coverPhoto: "https://www.strang.design/resources/projects/STRANG_COSTA_BRAVO_0888-Enhanced-NR-Edit_4K.jpg",
        images: [
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_1578-Enhanced-NR-Edit_4K.jpg",
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_0499-Enhanced-NR-Edit_4K-Copy_2026-01-09-175750_ysaj.jpg",
            "https://www.strang.design/resources/ARCHITECTURESARASOTA_STRANG_VANDERVLUGT_PHOTOS_RYAN_LESTER-43.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-32-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-45-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-25-LY-240712.jpg",
        ]
    },
    {
        id: 5,
        title: "DESERT CANOPY",
        description: "Designed as an oasis in an arid climate, this home utilizes a massive parasol roof to shade the underlying living pavilions and outdoor terraces. Rammed earth walls anchor the structure, providing exceptional thermal mass. The programmatic layout is organized around a linear reflection pool that naturally cools the prevailing breezes before they enter the home.",
        location: "SCOTTSDALE, AZ",
        date: "2022",
        sqft: "8,100 SF",
        coverPhoto: "https://www.strang.design/resources/DSC1443-LY-240712.jpg",
        images: [
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_1578-Enhanced-NR-Edit_4K.jpg",
            "https://www.strang.design/resources/home/STRANG_LAGOON_HOUSE_0499-Enhanced-NR-Edit_4K-Copy_2026-01-09-175750_ysaj.jpg",
            "https://www.strang.design/resources/ARCHITECTURESARASOTA_STRANG_VANDERVLUGT_PHOTOS_RYAN_LESTER-43.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-32-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-45-LY-240712.jpg",
            "https://www.strang.design/resources/Janoura-Residnce-by-Max-Strang-Architects-Photo-by-Robin-Hill-c-HI-RES-25-LY-240712.jpg",
        ]
    },

];

export default function StrangMimicPage() {
    const [accessState, setAccessState] = useState<'enter' | 'password' | 'unlocked'>('enter');
    const [password, setPassword] = useState('');
    const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

    const galleryRef = useRef<HTMLDivElement>(null);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '1234') {
            setAccessState('unlocked');
        } else {
            setPassword('');
        }
    };

    const openModal = (project: typeof PROJECTS[0]) => {
        setSelectedProject(project);
    };

    const scrollGallery = (direction: 'left' | 'right') => {
        if (galleryRef.current) {
            const gallery = galleryRef.current;
            const scrollAmount = direction === 'left' ? -gallery.clientWidth * 0.6 : gallery.clientWidth * 0.6;
            const targetScroll = gallery.scrollLeft + scrollAmount;

            animate(gallery.scrollLeft, targetScroll, {
                type: "tween",
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.7,
                onUpdate: (latest) => {
                    gallery.scrollLeft = latest;
                }
            });
        }
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {/*
                    LOCKED STATE
                */}
                {accessState !== 'unlocked' && (
                    <motion.main
                        key="locked-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center uppercase tracking-widest text-white"
                        style={{ fontFamily: '"DIN Pro Condensed", "DIN Alternate", sans-serif' }}
                    >
                        <div className="flex flex-col items-center">
                            <Image
                                src="/strang_logo/strang_logo.png"
                                alt="Strang Logo"
                                width={1200}
                                height={150}
                                className="object-contain mb-12 invert"
                                priority
                            />

                            <div className="h-22 w-64 flex justify-center mt-24 text-left">
                                {accessState === 'enter' ? (
                                    <button
                                        onClick={() => setAccessState('password')}
                                        className="w-full h-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                    >
                                        Enter
                                    </button>
                                ) : (
                                    <form onSubmit={handlePasswordSubmit} className="w-full h-full">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoFocus
                                            placeholder="PASSWORD"
                                            className="w-full h-full border border-white bg-black text-white text-center focus:outline-none placeholder:text-zinc-600"
                                        />
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.main>
                )}

                {/*
                    UNLOCKED STATE
                */}
                {accessState === 'unlocked' && (
                    <motion.main
                        key="unlocked-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="h-screen w-full bg-white text-black uppercase tracking-widest flex flex-col overflow-hidden text-left"
                        style={{ fontFamily: '"DIN Pro Condensed", "DIN Alternate", sans-serif' }}
                    >
                        {/* 6 Horizontal Photos (flex-col) */}
                        <div className="flex-1 w-full flex flex-col">
                            {PROJECTS.map((project, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.8 }}
                                    key={project.id}
                                    onClick={() => openModal(project)}
                                    className="flex-1 relative cursor-pointer group border-b border-white last:border-b-0 bg-zinc-900 overflow-hidden"
                                >
                                    {/* Background Image Container */}
                                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 bg-black">
                                        <img
                                            src={project.coverPhoto}
                                            alt={`${project.title} Cover`}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-20 transition-opacity duration-500"
                                        />
                                    </div>

                                    {/* Hover Text Reveal - Strictly Left Justified */}
                                    <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="text-left text-white">
                                            <h2 className="text-4xl md:text-6xl font-bold leading-none mb-2">
                                                {project.title}
                                            </h2>
                                            <p className="text-sm tracking-widest text-zinc-300">
                                                {project.location}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>

            {/*
                MODAL OVERLAY
            */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-12 backdrop-blur-sm"
                    >
                        {/*
                            Modal Box - Flies up to enter, flies down to exit.
                            Uses a high-end spring curve for elegance.
                        */}
                        <motion.div
                            initial={{ y: 150 }}
                            animate={{ y: 0 }}
                            exit={{ y: 150 }}
                            transition={{ type: "spring", damping: 30, stiffness: 280 }}
                            className="bg-white text-black w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto p-8 md:p-12 relative flex flex-col text-left shadow-2xl rounded-xl"
                            style={{ fontFamily: '"DIN Pro Condensed", "DIN Alternate", sans-serif' }}
                        >

                            {/* Luxurious Animated Close Button */}
                            <motion.button
                                onClick={() => setSelectedProject(null)}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors shadow-sm"
                            >
                                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M1 1L13 13M1 13L13 1" />
                                </svg>
                            </motion.button>

                            {/* Custom Navigation Gallery */}
                            <div className="relative w-full h-[40vh] min-h-[300px] shrink-0 mb-10 pb-2 overflow-hidden rounded-lg group">

                                {/* Left Arrow - Transparent with Drop Shadow */}
                                <button
                                    onClick={() => scrollGallery('left')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-transparent text-white w-12 h-24 flex items-center justify-center hover:scale-110 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                                >
                                    <span className="text-5xl font-light">‹</span>
                                </button>

                                {/* Scrolling Container */}
                                <div
                                    ref={galleryRef}
                                    className="w-full h-full flex gap-4 overflow-hidden bg-zinc-50 border border-zinc-200 p-2 shadow-inner"
                                >
                                    {selectedProject.images.map((imgSrc, i) => (
                                        <img
                                            key={i}
                                            src={imgSrc}
                                            alt={`${selectedProject.title} Image ${i + 1}`}
                                            className="h-full w-auto max-w-none object-cover bg-zinc-200 shadow-sm"
                                        />
                                    ))}
                                </div>

                                {/* Right Arrow - Transparent with Drop Shadow */}
                                <button
                                    onClick={() => scrollGallery('right')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-transparent text-white w-12 h-24 flex items-center justify-center hover:scale-110 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                                >
                                    <span className="text-5xl font-light">›</span>
                                </button>
                            </div>

                            {/* Project Info Layout */}
                            <div className="flex flex-col md:flex-row gap-12 text-left shrink-0">
                                {/* Left Column: Smaller Info + Logo (Forced to bottom) */}
                                <div className="w-full md:w-1/3 flex flex-col text-sm leading-relaxed order-2 md:order-1 text-left items-start">
                                    {/* Text Block */}
                                    <div>
                                        <h3 className="font-bold mb-2">PROJECT INFORMATION</h3>
                                        <p>LOCATION: {selectedProject.location}</p>
                                        <p>DATE COMPLETED: {selectedProject.date}</p>
                                        <p>SQUARE FOOTAGE: {selectedProject.sqft}</p>
                                    </div>

                                    {/* Appended Strang Logo - mt-auto pushes it to the absolute bottom */}
                                    <div className="mt-auto pt-8 w-full flex justify-start">
                                        <Image
                                            src="/strang_logo/strang_logo.png"
                                            alt="Strang Logo"
                                            width={140}
                                            height={45}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Title and Description */}
                                <div className="w-full md:w-2/3 order-1 md:order-2 text-left items-start">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-none text-left whitespace-pre-wrap">
                                        {selectedProject.title}
                                    </h2>
                                    <p className="text-sm md:text-base leading-relaxed normal-case tracking-normal font-sans text-left whitespace-pre-wrap">
                                        {selectedProject.description}
                                    </p>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}