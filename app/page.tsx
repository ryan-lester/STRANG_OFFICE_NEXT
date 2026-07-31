"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import UIOverlay from "./components/UIOverlay";

// --- SCENE IMPORTS ---
import TimelapseScene from "./scenes/TimelapseScene";
import StrangLetters from "./scenes/StrangLetters";
import SLIDESHOW_VDV_WIDE from "./scenes/SLIDESHOW_VDV_WIDE";
import SLIDESHOW_DRAWING_TARPONBEND from "./scenes/SLIDESHOW_DRAWING_TARPONBEND";
import HEADSHOTS_1 from "./scenes/HEADSHOTS_1";
import HEADSHOTS_2 from "./scenes/HEADSHOTS_2";
import HEADSHOTS_3 from "./scenes/HEADSHOTS_3";
import HEADSHOTS_4 from "./scenes/HEADSHOTS_4";
import HEADSHOTS_5 from "./scenes/HEADSHOTS_5";
import HEADSHOTS_6 from "./scenes/HEADSHOTS_6";
import HEADSHOTS_7 from "./scenes/HEADSHOTS_7";
import SLIDESHOW_DRAWING_VDV from "./scenes/SLIDESHOW_DRAWING_VDV";
import SLIDESHOW_KIAORA from "./scenes/SLIDESHOW_KIAORA";
import SLIDESHOW_WILDWOOD_PALM from "./scenes/SLIDESHOW_WILDWOOD_PALM";
import SLIDESHOW_ANGELOAKS_TARPONBEND from "./scenes/SLIDESHOW_ANGELOAKS_TARPONBEND";
import SLIDESHOW_FIVEPALMS_REVERSREACH from "@/app/scenes/SLIDESHOW_FIVEPALMS_REVERSREACH";
import SLIDESHOW_DRAWING_ROCKHOUSE from "@/app/scenes/SLIDESHOW_DRAWING_ROCKHOUSE";
import SLIDESHOW_ROCKHOUSE from "@/app/scenes/SLIDESHOW_ROCKHOUSE";
import BTS_1 from "@/app/scenes/BTS_1";
import MIAMI_VICE_ROCKHOUSE from "@/app/scenes/MIAMI_VICE_ROCKHOUSE";
import RockHouseVideo from "@/app/scenes/ROCKHOUSE_VIDEO";

const MASTER_SCENES = [
    { id: "rock_house_video", name: "Rock House Video", duration: 174000, component: RockHouseVideo, theme: "dark" },
    /*
        { id: "miami_vice", name: "Miami Vice Segment", duration: 62000, component: MIAMI_VICE_ROCKHOUSE, theme: "dark" },
    { id: "letters", name: "Strang Animation", duration: 23500, component: StrangLetters, theme: "light" },
    { id: "timelapse", name: "VdV Timelapses", duration: 118500, component: TimelapseScene, theme: "dark" },
    { id: "vdv_wide_photo", name: "VDV Wide Photo", duration: 179500, component: SLIDESHOW_VDV_WIDE, theme: "dark" },
    { id: "headshots_1", name: "Headshots 01", duration: 179500, component: HEADSHOTS_1, theme: "dark" },
    { id: "wildwood_palm", name: "Wildwood Palm", duration: 179500, component: SLIDESHOW_WILDWOOD_PALM, theme: "dark" },
    { id: "headshots_2", name: "Headshots 02", duration: 179500, component: HEADSHOTS_2, theme: "dark" },
    { id: "bts_1", name: "BTS 01", duration: 179500, component: BTS_1, theme: "dark" },
    { id: "tarpon_bend_photo", name: "Tarpon Bend Drawing", duration: 179500, component: SLIDESHOW_DRAWING_TARPONBEND, theme: "dark" },
    { id: "angeloaks_tarponbend", name: "Angel Oaks / Tarpon Bend", duration: 179500, component: SLIDESHOW_ANGELOAKS_TARPONBEND, theme: "dark" },
    { id: "headshots_3", name: "Headshots 03", duration: 179500, component: HEADSHOTS_3, theme: "dark" },
    { id: "vdv_sketch", name: "VDV Sketch", duration: 179500, component: SLIDESHOW_DRAWING_VDV, theme: "dark" },
    { id: "headshots_4", name: "Headshots 04", duration: 179500, component: HEADSHOTS_4, theme: "dark" },
    { id: "kiaora_photo", name: "Kiaora Photo", duration: 179500, component: SLIDESHOW_KIAORA, theme: "dark" },
    { id: "headshots_5", name: "Headshots 05", duration: 179500, component: HEADSHOTS_5, theme: "dark" },
    { id: "rockhouse_drawing", name: "Rockhouse Drawing", duration: 179500, component: SLIDESHOW_DRAWING_ROCKHOUSE, theme: "dark" },
    { id: "headshots_6", name: "Headshots 06", duration: 179500, component: HEADSHOTS_6, theme: "dark" },
    { id: "fivepalms_riversreach", name: "Five Palms / Rivers Reach", duration: 179500, component: SLIDESHOW_FIVEPALMS_REVERSREACH, theme: "dark" },
    { id: "headshots_7", name: "Headshots 07", duration: 179500, component: HEADSHOTS_7, theme: "dark" },
    { id: "rockhouse", name: "Rockhouse Photo", duration: 179500, component: SLIDESHOW_ROCKHOUSE, theme: "dark" },
    */
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
    const [syncStartTime, setSyncStartTime] = useState<number | null>(null);

    const broadcastState = (
        type: "EXECUTE_START" | "STOP",
        payload: any = {}
    ) => {
        const bc = new BroadcastChannel("strang_os_sync");
        bc.postMessage({ type, ...payload });
        bc.close();
    };

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    // --- MESSAGING ENGINE ---
    useEffect(() => {
        const bc = new BroadcastChannel("strang_os_sync");
        bc.onmessage = (event) => {
            const { type, isPlaying, index, playlist: list, currentLoop, startTime } = event.data;

            if (type === "EXECUTE_START") {
                setPlaylist(list);
                setIsPlaying(true);
                setCurrentIndex(index);
                setCurrentLoop(currentLoop);
                setSyncStartTime(startTime);
            } else if (type === "STOP") {
                setIsPlaying(false);
                setSyncStartTime(null);
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

    // --- HIGH-PRECISION CLOCK FOR NEXT-SCENE ROLLER ---
    useEffect(() => {
        if (!isPlaying || playlist.length === 0 || !syncStartTime) return;

        const activeSceneData = playlist[currentIndex];
        const sceneDef = MASTER_SCENES.find(s => s.id === activeSceneData.id);
        const duration = sceneDef?.duration || 5000;

        let frameId: number;

        const checkSync = () => {
            const now = Date.now();
            const elapsed = now - syncStartTime;

            if (elapsed >= duration) {
                if (screenID === "center") {
                    const nextStartTime = syncStartTime + duration;

                    if (currentLoop < activeSceneData.loops) {
                        const nextLoop = currentLoop + 1;
                        setCurrentLoop(nextLoop);
                        setSyncStartTime(nextStartTime);
                        broadcastState("EXECUTE_START", {
                            isPlaying: true,
                            index: currentIndex,
                            playlist,
                            currentLoop: nextLoop,
                            startTime: nextStartTime,
                        });
                    } else {
                        const nextIndex = (currentIndex + 1) % playlist.length;
                        setCurrentIndex(nextIndex);
                        setCurrentLoop(1);
                        setSyncStartTime(nextStartTime);
                        broadcastState("EXECUTE_START", {
                            isPlaying: true,
                            index: nextIndex,
                            playlist,
                            currentLoop: 1,
                            startTime: nextStartTime,
                        });
                    }
                }
            } else {
                frameId = requestAnimationFrame(checkSync);
            }
        };

        frameId = requestAnimationFrame(checkSync);
        return () => cancelAnimationFrame(frameId);
    }, [isPlaying, currentIndex, currentLoop, playlist, screenID, syncStartTime]);

    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen && !document.fullscreenElement) {
            elem.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        }
    };

    const handleGenerate = () => {
        if (isPreparing) return;
        setIsPreparing(true);

        const targetStart = Date.now() + 1000;

        broadcastState("EXECUTE_START", {
            isPlaying: true,
            index: 0,
            playlist,
            currentLoop: 1,
            startTime: targetStart,
        });

        setTimeout(() => {
            setIsPlaying(true);
            setCurrentIndex(0);
            setCurrentLoop(1);
            setSyncStartTime(targetStart);
            setIsPreparing(false);
        }, 1000);
    };

    const handleExit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsPlaying(false);
        setSyncStartTime(null);
        broadcastState("STOP");
    };

    const updateLoops = (index: number, delta: number) => {
        const newPlaylist = [...playlist];
        newPlaylist[index].loops = Math.max(1, newPlaylist[index].loops + delta);
        setPlaylist(newPlaylist);
    };

    const moveItem = (index: number, direction: "up" | "down") => {
        const newPlaylist = [...playlist];
        if (direction === "up" && index > 0) {
            [newPlaylist[index], newPlaylist[index - 1]] = [newPlaylist[index - 1], newPlaylist[index]];
        } else if (direction === "down" && index < newPlaylist.length - 1) {
            [newPlaylist[index], newPlaylist[index + 1]] = [newPlaylist[index + 1], newPlaylist[index]];
        }
        setPlaylist(newPlaylist);
    };

    if (!isPlaying) {
        if (screenID !== "center") {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center font-din-condensed overflow-hidden">
                    <div className="text-zinc-900 tracking-wider uppercase text-sm -rotate-90">Node Standby</div>
                </div>
            );
        }

        const totalMinutes = Math.round(playlist.reduce((acc, curr) => {
            const scene = MASTER_SCENES.find(s => s.id === curr.id);
            return acc + ((scene?.duration || 0) * curr.loops);
        }, 0) / 60000);

        return (
            <div className="h-screen bg-black text-zinc-400 font-din-condensed flex flex-col overflow-hidden">
                <header className="p-10 border-b border-white/5 bg-zinc-950/50">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-4xl font-bold tracking-wide text-white">STRANG</h1>
                            <p className="text-xs tracking-wider uppercase text-zinc-600 mt-2 font-bold">Screens Control</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-zinc-600 mb-1">Total Loop</p>
                            <p className="text-2xl tracking-normal text-white">~{totalMinutes}M</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={enterFullscreen}
                            className="w-full bg-zinc-900 border border-white/10 text-white py-7 font-bold tracking-wider uppercase hover:bg-zinc-800 transition-all active:scale-[0.98]"
                        >
                            {isFullscreen ? "Fullscreen Ready" : "1. Enter Fullscreen"}
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={isPreparing || playlist.length === 0}
                            className="w-full bg-white text-black py-7 font-bold tracking-wider uppercase hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-10"
                        >
                            {isPreparing ? "Syncing Nodes..." : "2. Launch Playback"}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <section className="mb-12 border-b border-white/5 pb-12">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-xs text-zinc-600 tracking-wider uppercase">Active Sequence</p>
                            <button onClick={() => setPlaylist([])} className="text-xs text-red-900 hover:text-red-500 uppercase tracking-wider">Clear All</button>
                        </div>
                        <div className="space-y-2">
                            {playlist.map((item, idx) => {
                                const scene = MASTER_SCENES.find(s => s.id === item.id);
                                return (
                                    <div
                                        key={`${item.id}-${idx}`}
                                        className="bg-zinc-900/40 border border-white/5 p-5 flex flex-col gap-4"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center min-w-0">
                                                <span className="text-zinc-800 text-sm font-bold">{idx + 1}</span>
                                                <h2 className="text-base uppercase tracking-wide text-white truncate">{scene?.name}</h2>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0">
                                                <button onClick={() => updateLoops(idx, -1)} className="text-zinc-500 hover:text-white px-2 text-lg">-</button>
                                                <span className="text-sm text-white font-bold tracking-normal">{item.loops}L</span>
                                                <button onClick={() => updateLoops(idx, 1)} className="text-zinc-500 hover:text-white px-2 text-lg">+</button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                            <div className="flex gap-4">
                                                <button
                                                    disabled={idx === 0}
                                                    onClick={() => moveItem(idx, "up")}
                                                    className="text-xs uppercase tracking-wider disabled:opacity-10 text-zinc-600 hover:text-zinc-300 transition-colors"
                                                >
                                                    Move Up
                                                </button>
                                                <button
                                                    disabled={idx === playlist.length - 1}
                                                    onClick={() => moveItem(idx, "down")}
                                                    className="text-xs uppercase tracking-wider disabled:opacity-10 text-zinc-600 hover:text-zinc-300 transition-colors"
                                                >
                                                    Move Down
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setPlaylist(playlist.filter((_, i) => i !== idx))}
                                                className="text-xs text-red-900 hover:text-red-500 uppercase tracking-wider"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="pb-32">
                        <p className="text-xs text-zinc-600 tracking-wider uppercase mb-6">Master Library</p>
                        <div className="grid grid-cols-1 gap-2">
                            {MASTER_SCENES.map(scene => (
                                <button
                                    key={scene.id}
                                    onClick={() => setPlaylist([...playlist, { id: scene.id, loops: 1 }])}
                                    className="w-full text-left p-5 border border-white/5 hover:bg-white hover:text-black transition-all flex flex-col gap-1 group"
                                >
                                    <span className="text-xs opacity-40 group-hover:opacity-100 uppercase tracking-wider">Available Scene</span>
                                    <span className="uppercase text-base tracking-wide font-bold">{scene.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    const activeSceneData = MASTER_SCENES.find(s => s.id === playlist[currentIndex]?.id);
    const ActiveComponent = activeSceneData?.component || (() => null);
    const activeTheme = activeSceneData?.theme || "dark";

    return (
        <main
            className={`fixed inset-0 bg-black font-din-condensed overflow-hidden select-none ${isFullscreen ? "cursor-none" : ""}`}
            style={{ border: "none", outline: "none", margin: 0, padding: 0 }}
        >
            <style jsx global>{`
              main * {
                border-color: transparent !important;
                outline: none !important;
              }
            `}</style>

            <div
                style={{
                    width: 2160,
                    height: 3840,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                }}
                className="relative bg-black overflow-hidden"
            >
                <div
                    className="absolute top-0 h-[3840px] w-[6480px]"
                    style={{
                        left: screenID === "left" ? "0px" : screenID === "center" ? "-2160px" : "-4320px",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >
                    <div className="w-full h-full">
                        <ActiveComponent />
                    </div>
                    <UIOverlay theme={activeTheme} />
                </div>
            </div>

            {/* Enter Full Screen Button */}
            {!isFullscreen && (
                <div className="absolute inset-x-0 bottom-20 flex justify-center z-[10003]">
                    <button
                        onClick={enterFullscreen}
                        className={`px-12 py-6 text-4xl font-bold tracking-wider uppercase shadow-2xl transition-colors ${
                            activeTheme === "light" ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-300"
                        }`}
                    >
                        Enter Full Screen
                    </button>
                </div>
            )}

            {/* Invisible exit button in top right */}
            <button onClick={handleExit} className="fixed top-0 right-0 w-32 h-32 opacity-0 z-[10002]" aria-label="Exit Display" />
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