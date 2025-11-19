import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import Navigation from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RedPill AI - Premium AI Tools for $REDPILL Holders',
  description: 'Hold $REDPILL tokens to unlock unlimited access to premium AI tools: image generation, meme creation, thread writing, voice cloning, and more.',
  keywords: ['crypto', 'AI', 'Solana', 'token', 'meme generator', 'image generation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen depth-background">
            <Navigation />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
