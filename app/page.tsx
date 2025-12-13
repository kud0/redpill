'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AccessCard from '@/components/AccessCard';
import MatrixEffects from '@/components/MatrixEffects';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  useEffect(() => {
    // Section reveal animations
    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );
    });
  }, []);

  return (
    <main className="relative bg-matrix-black min-h-screen text-white overflow-x-hidden">
      <MatrixEffects />

      {/* Navigation - Minimal */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="text-xl font-mono font-bold tracking-wider text-white pointer-events-auto cursor-pointer">
          REDPILL<span className="text-neon-red">.AI</span>
        </div>
        <div className="hidden md:block font-mono text-xs text-neon-red animate-pulse pointer-events-auto cursor-pointer border border-neon-red/30 px-3 py-1 bg-black/50 backdrop-blur-sm">
          SYSTEM_STATUS: CRITICAL
        </div>
      </nav>

      <Hero />

      <div className="relative z-10 space-y-32 pb-32">
        {/* Features Section */}
        <section id="features" className="reveal-section">
          <Features />
        </section>

        {/* Network Stats - Styled as a data tickertape or corrupted file */}
        <section className="reveal-section py-24 border-y border-white/5 bg-black/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-50"></div>

          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-neon-red font-mono text-xs tracking-[0.3em] mb-12 text-center uppercase opacity-70">
                {"// Global_Network_Parameters"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { label: "AGENTS_AWAKENED", value: "8,942" },
                { label: "REALITY_INTEGRITY", value: "34%" },
                { label: "UPTIME", value: "ERROR" }
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <div className="text-4xl md:text-6xl font-bold font-mono text-white mb-2 group-hover:text-neon-red transition-colors duration-300 glitch-text" data-text={stat.value}>
                    {stat.value}
                  </div>
                  <div className="text-gray-500 font-mono text-xs tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-50"></div>
        </section>

        {/* Wallet / CTA Section */}
        <section id="access" className="reveal-section px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display uppercase tracking-tighter">
              Escape the <span className="text-neon-red">Simulation</span>
            </h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Full system access requires cryptographic verification.
              <br />
              Connect your neural interface key to proceed.
            </p>
          </div>

          <AccessCard />

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-600 font-mono">
              CAUTION: NON-REVERSIBLE ACTION
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 bg-black text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-8 text-xs font-mono text-gray-500">
            <a href="#" className="hover:text-neon-red transition-colors">Orbit_Logs</a>
            <a href="#" className="hover:text-neon-red transition-colors">Manifesto</a>
            <a href="#" className="hover:text-neon-red transition-colors">Source_Code</a>
          </div>
          <p className="text-[10px] text-gray-700 font-mono tracking-widest">
            © 2025 REDPILL.AI // NO RIGHTS RESERVED // OPEN SOURCE REALITY
          </p>
        </div>
      </footer>
    </main>
  );
}
