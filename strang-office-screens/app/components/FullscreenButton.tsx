// app/page.tsx
import FullscreenButton from "./components/FullscreenButton";

// ... inside your DisplayManager return statement:
return (
    <main className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden cursor-none">
        {/* The Button stays fixed to the physical monitor's corner */}
        <FullscreenButton />

        <div
            style={{
                width: 2160, height: 3840,
                transform: `scale(${scale})`,
                transformOrigin: 'center center'
            }}
            className="relative overflow-hidden bg-black"
        >
            {/* THE TOTAL 6480px PANORAMIC STAGE */}
            <div
                className="absolute top-0 h-[3840px] w-[6480px] transition-all duration-700 ease-in-out"
                style={{ left: getOffset() }}
            >
                <UIOverlay />
            </div>
        </div>
    </main>
);