"use client";

import { useState, useEffect, useRef } from "react";

export interface SyncedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: string;
    syncStartTime?: number | null;
    onReady?: () => void;
    screenID?: "left" | "center" | "right" | string;
}

export interface SceneProps {
    syncStartTime?: number | null;
    screenID?: string;
}

// SHARED BLOB CACHE + PRELOADER
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

export function SyncedVideo({ src, syncStartTime, onReady, screenID = "center", ...props }: SyncedVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasPrewarmedRef = useRef(false);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    // 0. FULL PRELOAD (Download file 100% into RAM before mounting)
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
                if (!cancelled) setBlobUrl(src);
            });

        return () => {
            cancelled = true;
        };
    }, [src]);

    // 1. PRE-WARM DECODER
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

    // 2. ZERO-JITTER SYNC LOCK
    // We REMOVED the playbackRate flapping (0.98 / 1.02) entirely.
    // The video plays natively at 1.0x speed without browser buffer resets.
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !syncStartTime || !blobUrl) return;

        let frameId: number;
        let isStarted = false;
        let lastCheckAt = 0;

        // Force native speed — never change this dynamically!
        video.playbackRate = 1.0;

        // Only check once every 500ms, and ONLY hard-seek if a screen drifts
        // more than 200ms off-clock (e.g. if the browser tab froze).
        const DRIFT_THRESHOLD_SECONDS = 0.20;
        const CHECK_INTERVAL_MS = 500;

        const syncLoop = () => {
            const now = Date.now();
            const elapsed = now - syncStartTime;

            if (isStarted) {
                if (video.paused && elapsed > 0) {
                    video.play().catch(() => {});
                } else if (now - lastCheckAt >= CHECK_INTERVAL_MS) {
                    lastCheckAt = now;
                    const expectedTime = Math.max(0, elapsed / 1000);
                    const drift = Math.abs(video.currentTime - expectedTime);

                    if (drift > DRIFT_THRESHOLD_SECONDS) {
                        video.currentTime = expectedTime;
                    }
                }
            } else if (now >= syncStartTime) {
                isStarted = true;
                video.currentTime = 0.001;
                video.play()
                    .then(() => {
                        video.currentTime = Math.max(0, (Date.now() - syncStartTime) / 1000);
                    })
                    .catch(() => {});
            }

            frameId = requestAnimationFrame(syncLoop);
        };

        frameId = requestAnimationFrame(syncLoop);
        return () => {
            cancelAnimationFrame(frameId);
            if (video) video.playbackRate = 1.0;
        };
    }, [syncStartTime, blobUrl]);

    if (!blobUrl) return null;

    // Shift left by 0% on Left, -100% on Center, and -200% on Right.
    // (If your page.tsx DisplayManager ALREADY shifts by screenOffsetX,
    // change screenShift below to "0%" so it doesn't shift twice!)
    const screenShift = screenID === "left" ? "0%" : screenID === "center" ? "-100%" : "-200%";

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            <video
                ref={videoRef}
                src={blobUrl}
                preload="auto"
                muted
                playsInline
                style={{
                    // Stretch the 16:9 video across all 3 vertical screens (300% width)
                    width: "300%",
                    height: "100%",
                    transform: `translate3d(${screenShift}, 0, 0)`,
                    transformOrigin: "top left",
                    // REMOVED scale(1.005) to eliminate sub-pixel GPU stutter
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    display: "block",
                }}
                className="absolute top-0 left-0 object-cover border-0 outline-none"
                {...props}
            />
        </div>
    );
}