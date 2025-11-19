'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import BalanceChecker from '@/components/balance-checker';
import Link from 'next/link';
import ParticleField from '@/components/backgrounds/ParticleField';
import GradientMesh from '@/components/backgrounds/GradientMesh';
import DepthLayer from '@/components/backgrounds/DepthLayer';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/effects/ScrollReveal';
import GlassCard from '@/components/ui/GlassCard';
import PremiumButton from '@/components/ui/PremiumButton';
import MemeIcon from '@/components/icons/MemeIcon';
import ImageIcon from '@/components/icons/ImageIcon';
import ThreadIcon from '@/components/icons/ThreadIcon';
import VoiceIcon from '@/components/icons/VoiceIcon';
import VocalRemoverIcon from '@/components/icons/VocalRemoverIcon';
import RedPillLogo from '@/components/icons/RedPillLogo';

const features = [
  {
    name: 'Meme Generator',
    description: 'Create viral memes with AI-powered templates and trending formats',
    Icon: MemeIcon,
    href: '/meme-generator',
    tier: 'Basic',
  },
  {
    name: 'Image Generator',
    description: 'Generate stunning images with Flux.1 Pro and SD3 Medium',
    Icon: ImageIcon,
    href: '/image-generator',
    tier: 'Full',
  },
  {
    name: 'Thread Writer',
    description: 'Write engaging threads for X, Warpcast, and Lens Protocol',
    Icon: ThreadIcon,
    href: '/thread-writer',
    tier: 'Basic',
  },
  {
    name: 'Voice Cloner',
    description: 'Clone any voice with just 10 seconds of audio',
    Icon: VoiceIcon,
    href: '/voice-cloner',
    tier: 'Full',
  },
  {
    name: 'Vocal Remover',
    description: 'Split audio into stems: vocals, instrumental, drums, bass',
    Icon: VocalRemoverIcon,
    href: '/vocal-remover',
    tier: 'Full',
  },
];

const tiers = [
  {
    name: 'Basic',
    tokens: '500K',
    price: '$REDPILL',
    features: ['Image Generation (SD3)', 'Thread Writer', 'Meme Generator'],
    color: 'blue',
  },
  {
    name: 'Full Access',
    tokens: '2M',
    price: '$REDPILL',
    features: ['All Basic Features', 'Flux.1 Pro', 'Voice Cloner', 'Vocal Remover'],
    color: 'purple',
  },
  {
    name: 'God Mode',
    tokens: '10M',
    price: '$REDPILL',
    features: ['All Features', 'Priority Processing', 'Unlimited Requests', 'Early Access'],
    color: 'red',
  },
];

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="relative">
      {/* Background Effects - Multi-layered depth system */}
      <div className="fixed inset-0 -z-10">
        <DepthLayer />
        <GradientMesh />
        <ParticleField />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="relative text-center mb-12 sm:mb-16 min-h-[70vh] sm:min-h-[80vh] flex flex-col items-center justify-center px-4">
          <ScrollReveal animation="scale" duration={0.8}>
            <div className="inline-block mb-6 sm:mb-8">
              <RedPillLogo size="xl" variant="default" animated={true} glow={true} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={0.2} duration={0.8}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Take the{' '}
              <span className="bg-gradient-to-r from-redpill-400 via-redpill-500 to-redpill-600 text-transparent bg-clip-text animate-gradient bg-300%">
                Red Pill
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={0.4} duration={0.8}>
            <GlassCard className="max-w-3xl mx-auto p-6 sm:p-8 mb-6 sm:mb-8">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
                Hold $REDPILL tokens to unlock unlimited access to premium AI tools.
                No subscriptions. No limits. Just pure utility.
              </p>
            </GlassCard>
          </ScrollReveal>

          {!connected ? (
            <ScrollReveal animation="slide" direction="up" delay={0.6}>
              <div className="text-redpill-400 font-semibold text-base sm:text-lg mb-6 sm:mb-8 px-4">
                Connect your wallet to get started
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal animation="slide" direction="up" delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4">
                <PremiumButton variant="gradient" size="lg" glow className="w-full sm:w-auto">
                  Explore Tools
                </PremiumButton>
                <PremiumButton variant="ghost" size="lg" className="w-full sm:w-auto">
                  Learn More
                </PremiumButton>
              </div>
            </ScrollReveal>
          )}
        </div>

      {/* Balance Checker */}
      {connected && (
        <div className="max-w-2xl mx-auto mb-16">
          <BalanceChecker />
        </div>
      )}

      {/* Features Grid */}
      <div className="mb-12 sm:mb-16">
        <ScrollReveal animation="fade">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-12 text-center px-4">
            Premium AI Tools
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.1}>
          {features.map((feature) => {
            const IconComponent = feature.Icon;
            return (
              <StaggerItem key={feature.name}>
                <Link href={feature.href} className="block h-full group">
                  <GlassCard variant="elevated" glow className="p-6 sm:p-6 h-full transition-all duration-300 hover:scale-105 active:scale-95">
                    <div className="mb-4 flex justify-center">
                      <IconComponent size={56} className="drop-shadow-2xl sm:w-16 sm:h-16" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-redpill-400 transition-colors">
                      {feature.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-redpill-600/20 to-redpill-800/20 border border-redpill-500/30 text-redpill-400 text-xs sm:text-sm rounded-full font-semibold">
                        {feature.tier} Tier
                      </span>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-redpill-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Pricing Tiers */}
      <div className="mb-12 sm:mb-16">
        <ScrollReveal animation="fade">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-12 text-center px-4">
            Choose Your Level
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8" staggerDelay={0.15}>
          {tiers.map((tier) => (
            <StaggerItem key={tier.name}>
              <GlassCard
                variant={tier.color === 'red' ? 'glow' : 'elevated'}
                glow={tier.color === 'red'}
                glowColor="#dc2626"
                className={`p-6 sm:p-8 h-full relative overflow-hidden ${
                  tier.color === 'red' ? 'transform lg:scale-105 border-2 border-redpill-500' : ''
                }`}
              >
                {/* Premium badge for God Mode */}
                {tier.color === 'red' && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <div className="bg-gradient-to-r from-redpill-500 to-redpill-600 text-white text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
                      PREMIUM
                    </div>
                  </div>
                )}

                {/* Animated border for premium tier - reduced on mobile */}
                {tier.color === 'red' && (
                  <div className="absolute inset-0 rounded-2xl hidden sm:block">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-redpill-500 via-redpill-600 to-redpill-500 opacity-50 blur-xl animate-gradient bg-300%" />
                  </div>
                )}

                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{tier.name}</h3>

                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-baseline flex-wrap">
                      <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-redpill-400 to-redpill-600 text-transparent bg-clip-text">
                        {tier.tokens}
                      </span>
                      <span className="text-gray-400 ml-2 sm:ml-3 text-base sm:text-lg">{tier.price}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-200">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-redpill-500/20 flex items-center justify-center mr-2.5 sm:mr-3 mt-0.5">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-redpill-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="leading-relaxed text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PremiumButton
                    variant={tier.color === 'red' ? 'gradient' : 'secondary'}
                    size="lg"
                    glow={tier.color === 'red'}
                    className="w-full min-h-[48px]"
                  >
                    {tier.color === 'red' ? 'Get God Mode' : `Get ${tier.name}`}
                  </PremiumButton>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* CTA Section */}
      <ScrollReveal animation="scale">
        <GlassCard variant="glow" glow glowColor="#dc2626" className="text-center p-6 sm:p-8 md:p-12 relative overflow-hidden">
          {/* Background gradient animation - reduced on mobile */}
          <div className="absolute inset-0 bg-gradient-to-br from-redpill-600/20 via-redpill-500/10 to-transparent animate-gradient bg-300% hidden sm:block" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              Ready to Unlock Premium AI?
            </h2>
            <p className="text-gray-200 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Get $REDPILL tokens and access all premium AI tools instantly.
              No waiting, no approvals, no bullshit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <PremiumButton
                variant="gradient"
                size="lg"
                glow
                href="https://jup.ag"
                className="w-full sm:w-auto min-h-[48px]"
              >
                Buy on Jupiter
              </PremiumButton>
              <PremiumButton
                variant="ghost"
                size="lg"
                href="https://raydium.io"
                className="w-full sm:w-auto min-h-[48px]"
              >
                Trade on Raydium
              </PremiumButton>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>
      </div>
    </div>
  );
}
