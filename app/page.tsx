"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import UIOverlay from "./components/UIOverlay";

// --- SCENE IMPORTS ---
import TimelapseScene from "./scenes/TimelapseScene";
import HeadshotsScene from "./scenes/HeadshotsScene";
import StrangLetters from "./scenes/StrangLetters";
import VdVPhotos from "./scenes/VdVPhotos";

const MASTER_SCENES = [
    { id: "timelapse", name: "VdV Timelapses", duration: 118500, component: TimelapseScene, theme: "dark" },
    { id: "headshots", name: "Staff Headshots", duration: 150000, component: HeadshotsScene, theme: "dark" },
    { id: "letters", name: "Strang Animation", duration: 23500, component: StrangLetters, theme: "light" },
    { id: "architecture", name: "VdV Photos", duration: 100000, component: VdVPhotos, theme: "dark" },
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

    if (!isPlaying) {
        if (screenID !== "center") {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center font-din-condensed text-white">
                    <div className="text-center">
                        <h1 className="text-6xl tracking-[0.5em] font-bold uppercase opacity-20 animate-pulse">Standby</h1>
                        <p className="mt-6 text-zinc-600 tracking-widest uppercase text-xl">Waiting for launch</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-screen bg-black text-white font-din-condensed flex flex-col items-center">
                <div className="w-full max-w-[900px] flex flex-col h-full">
                    <header className="pt-20 pb-10 px-8 border-b border-white/10 shrink-0 bg-black z-10">
                        <h1 className="text-8xl tracking-[0.1em] font-bold uppercase leading-none">STRANG OS</h1>
                        <p className="text-zinc-600 text-xl mt-4 tracking-[0.4em] uppercase font-bold">CONTROL PANEL</p>
                    </header>

                    <main className="flex-1 overflow-y-auto px-8 py-10 space-y-3 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {playlist.map((item, index) => {
                                const scene = MASTER_SCENES.find(s => s.id === item.id);
                                return (
                                    <motion.div key={`${item.id}-${index}`} layout className="flex items-center bg-zinc-900/40 border border-white/5 h-24 shrink-0 overflow-hidden">
                                        <div className="flex flex-col border-r border-white/5 h-full w-20">
                                            <button onClick={() => {
                                                if (index > 0) {
                                                    const p = [...playlist];
                                                    [p[index], p[index-1]] = [p[index-1], p[index]];
                                                    setPlaylist(p);
                                                }
                                            }} className="flex-1 hover:bg-white hover:text-black transition-colors text-2xl">↑</button>
                                            <button onClick={() => {
                                                if (index < playlist.length - 1) {
                                                    const p = [...playlist];
                                                    [p[index], p[index+1]] = [p[index+1], p[index]];
                                                    setPlaylist(p);
                                                }
                                            }} className="flex-1 hover:bg-white hover:text-black transition-colors text-2xl border-t border-white/5">↓</button>
                                        </div>

                                        <div className="flex-1 px-8 flex items-center justify-between">
                                            <div className="flex items-center gap-6 text-ellipsis overflow-hidden whitespace-nowrap">
                                                <span className="text-zinc-700 text-3xl font-bold">{index + 1}</span>
                                                <h2 className="text-3xl tracking-widest uppercase truncate">{scene?.name}</h2>
                                            </div>
                                            <div className="flex items-center bg-black/40 border border-white/10 rounded shrink-0">
                                                <button onClick={() => updateLoops(index, -1)} className="px-4 py-2 hover:bg-white/10 text-xl">-</button>
                                                <div className="px-4 py-2 text-sm border-x border-white/10 min-w-[70px] text-center">{item.loops}L</div>
                                                <button onClick={() => updateLoops(index, 1)} className="px-4 py-2 hover:bg-white/10 text-xl">+</button>
                                            </div>
                                            <button onClick={() => setPlaylist(playlist.filter((_, i) => i !== index))} className="ml-8 text-zinc-600 hover:text-red-500 text-xs tracking-widest uppercase shrink-0">Remove</button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        <div className="pt-12 grid grid-cols-1 gap-2 pb-40">
                            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">Available Scenes</p>
                            {MASTER_SCENES.map(scene => (
                                <button
                                    key={scene.id}
                                    onClick={() => setPlaylist([...playlist, { id: scene.id, loops: 1 }])}
                                    className="border border-white/5 bg-zinc-900/10 p-6 text-zinc-600 hover:border-white/20 hover:text-white transition-all text-xl text-left tracking-widest uppercase"
                                >
                                    + {scene.name}
                                </button>
                            ))}
                        </div>
                    </main>

                    <footer className="shrink-0 p-8 border-t border-white/10 bg-black/80 backdrop-blur-md flex justify-center">
                        <button
                            onClick={handleGenerate}
                            disabled={isPreparing}
                            className={`w-full py-8 text-4xl font-bold tracking-[0.2em] transition-all uppercase ${
                                isPreparing ? "bg-zinc-800 text-zinc-500 cursor-wait" : "bg-white text-black hover:bg-zinc-200"
                            }`}
                        >
                            {isPreparing ? "Initializing..." : "Launch"}
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