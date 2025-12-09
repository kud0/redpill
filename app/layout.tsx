import type { Metadata } from 'next';
import { Space_Mono, Orbitron } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'RedPill AI - Break The Simulation',
  description: 'Hold $REDPILL tokens to unlock forbidden AI tools. Join the resistance.',
  keywords: ['crypto', 'AI', 'Solana', 'token', 'redpill', 'matrix', 'artificial intelligence'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceMono.variable} ${orbitron.variable} font-mono bg-matrix-black text-white selection:bg-neon-red selection:text-black overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
