"use client";

import { useState, useEffect, useRef } from "react";

// --- FRAME-ACCURATE SYNCED VIDEO WRAPPER ---
// Shared by page.tsx (playlist/orchestration) and every video-based scene
// (e.g. ROCKHOUSE_VIDEO.tsx). Pulled into its own file so scene components
// can import it without creating a circular dependency on app/page.tsx.

export interface SyncedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: string;
    syncStartTime?: number | null;
    onReady?: () => void;
}

// --- SCENE PROP TYPE DEFINITION ---
export interface SceneProps {
    syncStartTime?: number | null;
}

// --- SHARED BLOB CACHE + PRELOADER ---
// Module-level, so a video can start downloading the moment a screen's page
// loads — well before any scene mounts or Launch is clicked — and any
// component (the orchestrator in page.tsx, or SyncedVideo itself once the
// scene finally mounts) can await/observe the same in-flight download
// instead of starting a second one.
const blobCache = new Map<string, Promise<string>>();
const progressListeners = new Map<string, Set<(pct: number | null) => void>>();

function notifyProgress(src: string, pct: number | null) {
    progressListeners.get(src)?.forEach((cb) => cb(pct));
}

export function preloadVideo(src: string, onProgress?: (pct: number | null) => void): Promise<string> {
    if (onProgress) {
        if (!progressListeners.has(src)) progressListeners.set(src, new Set());
        progressListeners.get(src)!.add(onProgress);
    }

    const existing = blobCache.get(src);
    if (existing) return existing;

    const promise = (async () => {
        const res = await fetch(src);
        if (!res.ok || !res.body) throw new Error(`Fetch failed: ${res.status}`);

        // Content-Length is only readable cross-origin if the host sends
        // Access-Control-Expose-Headers: Content-Length. If it's missing we
        // just can't show a percentage — download still works fine.
        const total = Number(res.headers.get("Content-Length")) || 0;
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            notifyProgress(src, total ? Math.round((received / total) * 100) : null);
        }

        const blob = new Blob(chunks as BlobPart[]);
        const objectUrl = URL.createObjectURL(blob);
        notifyProgress(src, 100);
        return objectUrl;
    })();

    blobCache.set(src, promise);
    return promise;
}

export function SyncedVideo({ src, syncStartTime, onReady, ...props }: SyncedVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasPrewarmedRef = useRef(false);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    // 0. FULL PRELOAD: reuse (or start) the shared download for this URL, so
    // that if page.tsx already preloaded it before the scene mounted, this
    // resolves instantly instead of re-fetching.
    useEffect(() => {
        let cancelled = false;
        setBlobUrl(null);
        hasPrewarmedRef.current = false;

        preloadVideo(src)
            .then((url) => {
                if (!cancelled) setBlobUrl(url);
            })
            .catch((err) => {
                console.error("Video preload failed, falling back to direct src:", src, err);
                if (!cancelled) setBlobUrl(src); // fall back so playback isn't blocked entirely
            });

        return () => {
            cancelled = true;
        };
    }, [src]);

    // 1. PRE-WARM DECODER: Decode Frame 0 immediately once the fully-loaded
    // blob is attached, so .play() has zero latency when sync kicks in.
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !blobUrl) return;

        const handleCanPlay = () => {
            if (!hasPrewarmedRef.current) {
                hasPrewarmedRef.current = true;
                video.currentTime = 0.001;
            }
            if (onReady) onReady();
        };

        video.addEventListener("canplaythrough", handleCanPlay);
        return () => video.removeEventListener("canplaythrough", handleCanPlay);
    }, [blobUrl, onReady]);

    // 2. HIGH-PRECISION LOCK ENGINE
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !syncStartTime || !blobUrl) return;

        let frameId: number;
        let isStarted = false;
        let lastCorrectionAt = 0;
        let appliedRate = 1.0;
        // Hysteresis: only start nudging the rate once drift exceeds ENTER,
        // and don't relax back to 1.0x until drift falls under EXIT. Without
        // this, drift sitting right on a single threshold makes playbackRate
        // flap between 0.97/1.0/1.03 many times a second — that flapping is
        // what reads as stutter/jitter, not the video file itself. Also only
        // re-evaluate a few times a second instead of every frame, since the
        // browser doesn't even finish responding to a rate change in 16ms.
        let correcting = false;
        const ENTER_DRIFT = 0.15;
        const EXIT_DRIFT = 0.04;
        const CORRECTION_INTERVAL_MS = 200;

        const setRate = (rate: number) => {
            if (appliedRate !== rate) {
                video.playbackRate = rate;
                appliedRate = rate;
            }
        };

        const syncLoop = () => {
            const now = Date.now();
            const elapsed = now - syncStartTime;

            if (!video.paused && isStarted) {
                const expectedTime = Math.max(0, elapsed / 1000);
                const drift = video.currentTime - expectedTime;

                if (Math.abs(drift) > 1.0) {
                    video.currentTime = expectedTime;
                    setRate(1.0);
                    correcting = false;
                } else if (now - lastCorrectionAt >= CORRECTION_INTERVAL_MS) {
                    lastCorrectionAt = now;

                    if (!correcting && Math.abs(drift) > ENTER_DRIFT) {
                        correcting = true;
                    } else if (correcting && Math.abs(drift) < EXIT_DRIFT) {
                        correcting = false;
                    }

                    setRate(correcting ? (drift < 0 ? 1.03 : 0.97) : 1.0);
                }
            } else if (now >= syncStartTime && !isStarted) {
                isStarted = true;
                video.currentTime = 0.1;
                video.play().then(() => {
                    video.currentTime = Math.max(0, (Date.now() - syncStartTime) / 1000);
                }).catch(() => {});
            }

            frameId = requestAnimationFrame(syncLoop);
        };

        frameId = requestAnimationFrame(syncLoop);
        return () => {
            cancelAnimationFrame(frameId);
            if (video) video.playbackRate = 1.0;
        };
    }, [syncStartTime, blobUrl]);

    // Nothing to render until the file is fully local — prevents the browser
    // from ever attaching a partially-buffered network stream as the source,
    // and prevents any premature native playback.
    if (!blobUrl) return null;

    return (
        <video
            ref={videoRef}
            src={blobUrl}
            preload="auto"
            muted
            playsInline
            style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                transform: "scale(1.005)",
                transformOrigin: "center center",
            }}
            className="w-full h-full object-cover border-0 outline-none"
            {...props}
        />
    );
}