"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import UIOverlay from "./components/UIOverlay";

// --- SCENE IMPORTS ---
import TimelapseScene from "./scenes/TimelapseScene";
import StrangLetters from "./scenes/StrangLetters";
import SLIDESHOW_VDV_WIDE from "./scenes/SLIDESHOW_VDV_WIDE";
import HEADSHOTS_1 from "./scenes/HEADSHOTS_1";
import HEADSHOTS_2 from "./scenes/HEADSHOTS_2";
import HEADSHOTS_3 from "./scenes/HEADSHOTS_3";
import HEADSHOTS_4 from "./scenes/HEADSHOTS_4";
import HEADSHOTS_5 from "./scenes/HEADSHOTS_5";
import HEADSHOTS_6 from "./scenes/HEADSHOTS_6";
import HEADSHOTS_7 from "./scenes/HEADSHOTS_7";









const MASTER_SCENES = [
    { id: "timelapse", name: "VdV Timelapses (2m)", duration: 118500, component: TimelapseScene, theme: "dark" },
    { id: "letters", name: "Strang Animation (24s)", duration: 23500, component: StrangLetters, theme: "light" },
    { id: "vdv_wide_photo", name: "VDV WIDE PHOTO (3m)", duration: 179500, component: SLIDESHOW_VDV_WIDE, theme: "dark" },
    { id: "headshots_1", name: "Headshots 1 (3m)", duration: 179500, component: HEADSHOTS_1, theme: "dark" },
    { id: "headshots_2", name: "Headshots 2 (3m)", duration: 179500, component: HEADSHOTS_2, theme: "dark" },
    { id: "headshots_3", name: "Headshots 3 (3m)", duration: 179500, component: HEADSHOTS_3, theme: "dark" },
    { id: "headshots_4", name: "Headshots 4 (3m)", duration: 179500, component: HEADSHOTS_4, theme: "dark" },
    { id: "headshots_5", name: "Headshots 5 (3m)", duration: 179500, component: HEADSHOTS_5, theme: "dark" },
    { id: "headshots_6", name: "Headshots 6 (3m)", duration: 179500, component: HEADSHOTS_6, theme: "dark" },
    { id: "headshots_7", name: "Headshots 7 (3m)", duration: 179500, component: HEADSHOTS_7, theme: "dark" },






];

function DisplayManager() {
    const searchParams = useSearchParams();
    const screenID = (searchParams.get("screen") || "center").toLowerCase();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const [scale, setScale] = useState(1);
    const [playlist, setPlaylist] = useState(MASTER_SCENES.map(s => ({ id: s.id, loops: 1 })));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentLoop, setCurrentLoop] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const broadcastState = (playing: boolean, index: number, list: any[], loop: number, startAt?: number) => {
        const bc = new BroadcastChannel("strang_os_sync");
        bc.postMessage({ isPlaying: playing, index, playlist: list, currentLoop: loop, startAt });
        bc.close();
    };

    useEffect(() => {
        const bc = new BroadcastChannel("strang_os_sync");
        bc.onmessage = (event) => {
            const { isPlaying, index, playlist: list, currentLoop, startAt } = event.data;
            const applyState = () => {
                setPlaylist(list);
                setIsPlaying(isPlaying);
                setCurrentIndex(index);
                setCurrentLoop(currentLoop);
            };
            if (startAt && startAt > Date.now()) {
                setTimeout(applyState, startAt - Date.now());
            } else {
                applyState();
            }
        };
        return () => bc.close();
    }, []);

    useEffect(() => {
        const handleResize = () => setScale(window.innerHeight / 3840);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        if (!isPlaying || playlist.length === 0 || screenID !== "center") return;
        const activeSceneData = playlist[currentIndex];
        const sceneDef = MASTER_SCENES.find(s => s.id === activeSceneData.id);

        const timer = setTimeout(() => {
            if (currentLoop < activeSceneData.loops) {
                const nextLoop = currentLoop + 1;
                setCurrentLoop(nextLoop);
                broadcastState(true, currentIndex, playlist, nextLoop);
            } else {
                const nextIndex = (currentIndex + 1) % playlist.length;
                setCurrentIndex(nextIndex);
                setCurrentLoop(1);
                broadcastState(true, nextIndex, playlist, 1);
            }
        }, sceneDef?.duration || 5000);

        return () => clearTimeout(timer);
    }, [isPlaying, currentIndex, currentLoop, playlist, screenID]);

    const updateLoops = (index: number, delta: number) => {
        const newPlaylist = [...playlist];
        newPlaylist[index].loops = Math.max(1, newPlaylist[index].loops + delta);
        setPlaylist(newPlaylist);
    };

    const handleGenerate = () => {
        if (isPreparing) return;
        setIsPreparing(true);
        const delayMs = 1200;
        const startAt = Date.now() + delayMs;
        broadcastState(true, 0, playlist, 1, startAt);
        setTimeout(() => {
            setIsPlaying(true);
            setCurrentIndex(0);
            setCurrentLoop(1);
            setIsPreparing(false);
        }, delayMs);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error enabling full-screen: ${err.message}`);
            });
        }
    };

    const handleExit = () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
        }
        setIsPlaying(false);
        broadcastState(false, 0, playlist, 1);
    };

    // --- 1. LOBBY VIEW (MODIFIED FOR CLEANER / SMALLER UI) ---
    if (!isPlaying) {
        if (screenID !== "center") {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center font-din-condensed text-white">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-[0.5em] font-bold uppercase opacity-20 animate-pulse">Standby</h1>
                        <p className="mt-4 text-zinc-600 tracking-widest uppercase text-sm">Waiting for launch</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-screen bg-black text-white font-din-condensed flex flex-col items-center overflow-hidden">
                <div className="w-full max-w-[700px] flex flex-col h-full border-x border-white/5 bg-zinc-950/20 shadow-2xl">
                    <header className="pt-12 pb-6 px-10 border-b border-white/10 shrink-0 bg-black/50 backdrop-blur-xl z-10">
                        <div className="flex items-baseline justify-between">
                            <h1 className="text-6xl tracking-[0.05em] font-bold uppercase leading-none">STRANG LOBBY</h1>
                            <span className="text-zinc-600 text-sm tracking-[0.3em] uppercase font-bold">V 1.0</span>
                        </div>
                        <p className="text-zinc-600 text-xs mt-3 tracking-[0.4em] uppercase font-bold opacity-80">CONTROL PANEL</p>
                    </header>

                    <main className="flex-1 overflow-y-auto px-10 py-6 space-y-2 custom-scrollbar">
                        <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase mb-4 font-bold">Playlist Queue</p>
                        <AnimatePresence mode="popLayout">
                            {playlist.map((item, index) => {
                                const scene = MASTER_SCENES.find(s => s.id === item.id);
                                return (
                                    <motion.div key={`${item.id}-${index}`} layout className="flex items-center bg-zinc-900/30 border border-white/5 h-16 shrink-0 group hover:border-white/20 transition-all">
                                        <div className="flex flex-col border-r border-white/5 h-full w-12 shrink-0">
                                            <button onClick={() => {
                                                if (index > 0) {
                                                    const p = [...playlist];
                                                    [p[index], p[index-1]] = [p[index-1], p[index]];
                                                    setPlaylist(p);
                                                }
                                            }} className="flex-1 hover:bg-white hover:text-black transition-colors text-lg opacity-40 hover:opacity-100">↑</button>
                                            <button onClick={() => {
                                                if (index < playlist.length - 1) {
                                                    const p = [...playlist];
                                                    [p[index], p[index+1]] = [p[index+1], p[index]];
                                                    setPlaylist(p);
                                                }
                                            }} className="flex-1 hover:bg-white hover:text-black transition-colors text-lg border-t border-white/5 opacity-40 hover:opacity-100">↓</button>
                                        </div>

                                        <div className="flex-1 px-6 flex items-center justify-between min-w-0">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <span className="text-zinc-800 text-xl font-bold">{index + 1}</span>
                                                <h2 className="text-xl tracking-widest uppercase truncate font-medium">{scene?.name}</h2>
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="flex items-center bg-black/60 border border-white/5 rounded overflow-hidden">
                                                    <button onClick={() => updateLoops(index, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-lg">-</button>
                                                    <div className="px-2 text-xs border-x border-white/10 min-w-[40px] text-center font-bold tracking-tighter text-zinc-400">{item.loops} L</div>
                                                    <button onClick={() => updateLoops(index, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-lg">+</button>
                                                </div>

                                                <button onClick={() => setPlaylist(playlist.filter((_, i) => i !== index))} className="text-zinc-700 hover:text-red-500 text-[10px] tracking-widest uppercase transition-colors px-2">Delete</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        <div className="pt-8 grid grid-cols-1 gap-1.5 pb-20">
                            <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase mb-2 font-bold">Add To Queue</p>
                            {MASTER_SCENES.map(scene => (
                                <button
                                    key={scene.id}
                                    onClick={() => setPlaylist([...playlist, { id: scene.id, loops: 1 }])}
                                    className="border border-white/5 bg-zinc-900/10 py-4 px-6 text-zinc-500 hover:border-white/30 hover:bg-white/5 hover:text-white transition-all text-lg text-left tracking-[0.2em] uppercase font-medium"
                                >
                                    + {scene.name}
                                </button>
                            ))}
                        </div>
                    </main>

                    <footer className="shrink-0 p-10 border-t border-white/10 bg-black z-20">
                        <button
                            onClick={handleGenerate}
                            disabled={isPreparing}
                            className={`w-full py-6 text-2xl font-bold tracking-[0.3em] transition-all uppercase shadow-2xl ${
                                isPreparing ? "bg-zinc-900 text-zinc-700 cursor-wait" : "bg-white text-black hover:bg-zinc-200"
                            }`}
                        >
                            {isPreparing ? "Initializing System..." : "Launch"}
                        </button>
                    </footer>
                </div>
            </div>
        );
    }

    const activeSceneData = MASTER_SCENES.find(s => s.id === playlist[currentIndex]?.id);
    const ActiveComponent = activeSceneData?.component || (() => null);
    const activeTheme = activeSceneData?.theme || "dark";

    return (
        <main className={`fixed inset-0 bg-black overflow-hidden ${isFullscreen ? 'cursor-none' : ''}`}>
            <div style={{ width: 2160, height: 3840, transform: `scale(${scale})`, transformOrigin: 'top left' }} className="relative bg-black">
                <div
                    className="absolute top-0 h-[3840px] w-[6480px] transition-all duration-1000 ease-in-out"
                    style={{ left: screenID === 'left' ? '0px' : screenID === 'center' ? '-2160px' : '-4320px' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSceneData?.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                        >
                            <ActiveComponent />
                        </motion.div>
                    </AnimatePresence>
                    <UIOverlay theme={activeTheme} />
                </div>
            </div>

            {!isFullscreen && (
                <div className="absolute inset-x-0 bottom-20 flex justify-center z-[10003]">
                    <button
                        onClick={toggleFullscreen}
                        className={`px-12 py-6 text-4xl font-din-condensed font-bold tracking-[0.2em] uppercase shadow-2xl transition-colors ${
                            activeTheme === "light" ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-300"
                        }`}
                    >
                        Enter Full Screen
                    </button>
                </div>
            )}
            <button onClick={handleExit} className="fixed top-0 right-0 w-32 h-32 opacity-0 z-[10002]" />
        </main>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div className="bg-black h-screen" />}>
            <DisplayManager />
        </Suspense>
    );
}