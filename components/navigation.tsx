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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 group transition-transform hover:scale-105 active:scale-95"
          >
            <RedPillLogo size="sm" variant="icon" animated={true} glow={true} />
            <span className="text-base sm:text-xl font-bold text-white group-hover:text-redpill-400 transition-colors">
              RedPill AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center ${
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

          {/* Mobile Menu Button - Only show on mobile/tablet */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-dark-300/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Wallet Connect - Desktop only */}
          <div className="hidden lg:flex items-center">
            <WalletConnect />
          </div>
        </div>

        {/* Mobile Navigation - Improved dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 space-y-2 animate-slide-up">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 min-h-[48px] flex items-center ${
                    isActive
                      ? 'bg-redpill-600 text-white redpill-glow'
                      : 'text-gray-300 hover:bg-dark-300/50 hover:text-white active:bg-dark-300/70'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            {/* Mobile Wallet Connect */}
            <div className="pt-2 border-t border-white/10">
              <WalletConnect />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
