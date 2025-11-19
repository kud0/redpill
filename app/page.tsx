'use client';

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import TheRedPill from '@/components/TheRedPill';
import GlitchText from '@/components/GlitchText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: 'MEME_GENERATOR',
    desc: 'Inject viral mimetic viruses.',
    href: '/meme-generator'
  },
  {
    title: 'VOICE_CLONER',
    desc: 'Steal any identity in 10 seconds.',
    href: '/voice-cloner'
  },
  {
    title: 'GOD_MODE',
    desc: 'Uncensored AI access.',
    href: '/image-generator'
  },
  {
    title: 'THREAD_WRITER',
    desc: 'Weaponized social engineering.',
    href: '/thread-writer'
  },
  {
    title: 'VOCAL_REMOVER',
    desc: 'Audio manipulation matrix.',
    href: '/vocal-remover'
  },
  {
    title: 'IMAGE_GEN',
    desc: 'Reality synthesis engine.',
    href: '/image-generator'
  },
];

export default function Home() {
  const { connected } = useWallet();

  useEffect(() => {
    // Animate sections fading in on scroll
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(section => {
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
    <main className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-red-600 selection:text-black">
      {/* HEADER / NAV */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-xl font-mono font-bold tracking-wider">REDPILL.AI</div>
        <WalletMultiButton className="!bg-transparent !border !border-red-600 !px-6 !py-2 hover:!bg-red-600 hover:!text-black !transition-all !font-mono !text-sm" />
      </nav>

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <TheRedPill />
        </div>

        <div className="z-10 text-center pointer-events-none px-4">
          <GlitchText text="WAKE UP NEO" />
          <p className="mt-6 max-w-md mx-auto text-gray-400 font-mono text-sm leading-relaxed">
            Hold $REDPILL. Break the simulation. Access forbidden AI tools.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-red-500 font-mono text-xs tracking-widest">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-red-500 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-4 reveal-section relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-red-600 font-mono">
            &gt; SYSTEM_TOOLS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="group border border-gray-800 p-8 hover:border-red-600 transition-all duration-300 bg-black/50 backdrop-blur-sm cursor-pointer relative overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-transparent transition-all duration-500"></div>

                <div className="relative z-10">
                  <div className="w-0 h-1 bg-red-600 mb-4 group-hover:w-12 transition-all duration-300"></div>
                  <h3 className="text-2xl font-bold mb-2 font-mono group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-300 transition-colors font-mono text-sm">
                    {item.desc}
                  </p>

                  {/* Terminal cursor */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-red-500 font-mono text-xs animate-pulse">&gt;_</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 px-4 reveal-section relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-red-600 font-mono">
            &gt; NETWORK_STATUS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'AGENTS_ONLINE', value: '∞' },
              { label: 'REALITY_BREACH', value: '100%' },
              { label: 'SIMULATION_DELAY', value: '0ms' },
            ].map((stat, i) => (
              <div
                key={i}
                className="border border-gray-800 p-8 bg-black/50 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="text-gray-500 font-mono text-sm mb-2 tracking-wider">
                  {stat.label}
                </div>
                <div className="text-5xl font-bold font-mono text-red-500 tabular-nums">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 reveal-section relative z-10">
        <div className="max-w-4xl mx-auto text-center border border-red-600/30 p-12 bg-black/50 backdrop-blur-sm relative overflow-hidden group">
          {/* Animated border effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-red-600 to-transparent animate-pulse"></div>
            <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-red-600 to-transparent animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <p className="text-red-500 font-mono mb-4 tracking-widest text-sm">
              READY TO ESCAPE?
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono">
              TAKE THE <span className="text-red-600">RED PILL</span>
            </h2>
            <p className="text-gray-400 font-mono text-sm mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect your wallet. Hold $REDPILL tokens. Access the forbidden AI tools that break reality.
            </p>

            {!connected ? (
              <WalletMultiButton className="!bg-red-600 !border-0 !px-8 !py-4 hover:!bg-red-700 !transition-all !font-mono !text-sm !tracking-wider" />
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://jup.ag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-red-600 px-8 py-4 hover:bg-red-600 hover:text-black transition-all font-mono text-sm tracking-wider"
                >
                  BUY ON JUPITER
                </a>
                <a
                  href="https://raydium.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-600 px-8 py-4 hover:border-red-600 hover:text-red-500 transition-all font-mono text-sm tracking-wider"
                >
                  TRADE ON RAYDIUM
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 font-mono text-sm">
            &copy; 2025 REDPILL.AI — ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors font-mono text-sm">
              TWITTER
            </a>
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors font-mono text-sm">
              DISCORD
            </a>
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors font-mono text-sm">
              DOCS
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
