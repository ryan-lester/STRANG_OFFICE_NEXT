"use client";
import { useState, useEffect } from "react";

export default function UIOverlay({ theme = "dark" }: { theme?: string }) {
    const [time, setTime] = useState("");
    const [weather, setWeather] = useState("LOADING...");

    useEffect(() => {
        const updateTime = () => {
            const est = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
            }).format(new Date());
            setTime(est);
            requestAnimationFrame(updateTime);
        };
        const animId = requestAnimationFrame(updateTime);

        const fetchWeather = async () => {
            try {
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=25.7617&longitude=-80.1918&current_weather=true&temperature_unit=fahrenheit');
                const data = await res.json();
                setWeather(`${Math.round(data.current_weather.temperature)}°F`);
            } catch (e) { setWeather("--°F"); }
        };

        fetchWeather();
        const weatherInterval = setInterval(fetchWeather, 600000);

        return () => {
            cancelAnimationFrame(animId);
            clearInterval(weatherInterval);
        };
    }, []);

    // Determine colors and shadows based on the theme prop
    const isLight = theme === "light";
    const themeClasses = isLight
        ? "text-black drop-shadow-none" // Black text, no shadow for clean look on light backgrounds
        : "text-white drop-shadow-2xl"; // White text, heavy shadow for readability on dark backgrounds

    // Sized for 4K Vertical (2160x3840)
    const cornerClass = `absolute font-din-condensed text-[120px] tracking-[4px] z-[9999] transition-colors duration-1000 ${themeClasses}`;

    return (
        <div className="absolute top-0 left-0 w-[6480px] h-[3840px] pointer-events-none p-[120px]">
            {/* Far Left Screen */}
            <div className={`${cornerClass} top-[120px] left-[120px]`}>STRANG.DESIGN</div>
            <div className={`${cornerClass} bottom-[120px] left-[120px]`}>MIAMI</div>

            {/* Far Right Screen */}
            <div className={`${cornerClass} top-[120px] right-[120px] text-right`}>{time}</div>
            <div className={`${cornerClass} bottom-[120px] right-[120px] text-right`}>{weather}</div>
        </div>
    );
}