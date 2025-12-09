'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export default function AccessCard() {
    const { connected, publicKey } = useWallet();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-64 w-full animate-pulse bg-white/5 rounded-xl"></div>;

    return (
        <div className="relative group max-w-md mx-auto" style={{ perspective: '1000px' }}>
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-red to-transparent rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            {/* Card Content */}
            <div className="relative bg-matrix-black border border-white/10 rounded-xl p-8 shadow-2xl overflow-hidden transform transition-all duration-500 group-hover:rotate-x-12">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {/* Top Section */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex flex-col gap-1">
                        <div className="w-8 h-8 rounded border border-neon-red/50 flex items-center justify-center">
                            <div className="w-4 h-4 bg-neon-red/20 animate-pulse"></div>
                        </div>
                        <span className="text-[9px] text-neon-red font-mono tracking-widest mt-1">SECURE_CHIP</span>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 mb-1 border-b border-white/10 pb-1">ACCESS STATUS</div>
                        <div className={`text-xl font-mono font-bold tracking-wider ${connected ? 'text-neon-green' : 'text-red-500'}`}>
                            {connected ? 'GRANTED' : 'RESTRICTED'}
                        </div>
                    </div>
                </div>

                {/* Identity Section */}
                <div className="mb-8 relative z-10">
                    <div className="text-[10px] text-gray-500 mb-2">IDENTITY_HASH</div>
                    <div className="bg-black/50 border border-white/5 p-3 font-mono text-xs text-white/70 tracking-widest break-all rounded relative overflow-hidden">
                        {connected && publicKey ? publicKey.toString() : 'NO_SIGNAL_FOUND // CONNECT_IMMEDIATELY'}
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-neon-red/50 animate-scanline"></div>
                    </div>
                </div>

                {/* Wallet Button Override */}
                <div className="relative z-10 wallet-adapter-override">
                    <WalletMultiButton className="!w-full !justify-center !bg-neon-red !text-black !font-mono !font-bold !uppercase !tracking-widest !py-4 !rounded-none hover:!bg-white !transition-colors !border-none" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 left-4 text-[9px] text-gray-600 font-mono">
                    V.4.2.0
                </div>
                <div className="absolute bottom-4 right-4 text-[9px] text-gray-600 font-mono flex gap-2">
                    <span>ENCRYPTED</span>
                    <span className="w-2 h-2 rounded-full bg-neon-green/50 animate-pulse"></span>
                </div>
            </div>
        </div>
    );
}
