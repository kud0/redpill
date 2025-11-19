'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import WalletConnect from './wallet-connect';
import RedPillLogo from './icons/RedPillLogo';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Meme Generator', href: '/meme-generator' },
  { name: 'Image Generator', href: '/image-generator' },
  { name: 'Thread Writer', href: '/thread-writer' },
  { name: 'Voice Cloner', href: '/voice-cloner' },
  { name: 'Vocal Remover', href: '/vocal-remover' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b redpill-border transition-all duration-300 ${
        scrolled
          ? 'bg-dark-400/95 backdrop-blur-xl shadow-lg shadow-redpill-900/20'
          : 'bg-dark-400/80 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group transition-transform hover:scale-105"
          >
            <RedPillLogo size="sm" variant="icon" animated={true} glow={true} />
            <span className="text-xl font-bold text-white group-hover:text-redpill-400 transition-colors">
              RedPill AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-redpill-600 text-white redpill-glow scale-105'
                      : 'text-gray-300 hover:bg-dark-300/50 hover:text-white hover:scale-105 hover:backdrop-blur-sm'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-redpill-600 text-white redpill-glow'
                      : 'text-gray-300 hover:bg-dark-300/50 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
