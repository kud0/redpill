'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

const TheRedPill = dynamic(() => import('./TheRedPill'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />
});
import GlitchText from './GlitchText';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (!containerRef.current || !textRef.current) return;

        const tl = gsap.timeline();

        // Initial sequence
        tl.to(containerRef.current, {
            opacity: 1,
            duration: 2,
            ease: 'power2.inOut',
        })
            .fromTo(textRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                '-=0.5'
            );

    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden opacity-0">

            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {mounted && <TheRedPill />}
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-matrix-black/50 to-matrix-black z-10 pointer-events-none" />

            {/* Main Content */}
            <div className="z-20 text-center px-4 relative mix-blend-screen">
                <div ref={textRef} className="flex flex-col items-center gap-6">
                    <div className="border border-neon-red/30 bg-black/50 backdrop-blur-sm px-4 py-1 text-neon-red font-mono text-xs tracking-widest uppercase mb-4 animate-pulse">
                        System Breach Detected
                    </div>

                    <GlitchText text="WAKE UP NEO" />

                    <p className="max-w-xl mx-auto text-gray-400 font-mono text-base md:text-lg leading-relaxed mt-4 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                        The simulation is crumbling. <span className="text-neon-red glow">Take the Red Pill</span>.
                        <br />
                        Break the code. Own the future.
                    </p>

                    <div className="mt-12 flex gap-6">
                        <button className="group relative px-8 py-3 bg-neon-red/10 border border-neon-red text-neon-red font-mono font-bold tracking-wider overflow-hidden transition-all hover:bg-neon-red hover:text-black">
                            <span className="relative z-10">INITIALIZE_BREACH</span>
                            <div className="absolute inset-0 bg-neon-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50">
                <span className="text-[10px] font-mono tracking-[0.2em] text-neon-red animate-pulse">SCROLL_DOWN</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-neon-red via-neon-red to-transparent animate-pulse-slow"></div>
            </div>
        </section>
    );
}
