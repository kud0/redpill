'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState, useCallback } from 'react';
import { UserTier, TIER_CONFIGS, TierLevel } from '@/lib/types';

// Format large numbers (500K, 2M, 10M)
function formatTokens(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000) + 'M';
    if (n >= 1_000) return (n / 1_000) + 'K';
    return n.toString();
}

export default function AccessCard() {
    const { connected, publicKey } = useWallet();
    const [mounted, setMounted] = useState(false);
    const [tier, setTier] = useState<UserTier | null>(null);
    const [loading, setLoading] = useState(false);

    const checkBalance = useCallback(async () => {
        if (!publicKey) return;
        setLoading(true);
        try {
            const response = await fetch('/api/check-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet: publicKey.toString() }),
            });
            if (response.ok) {
                const data = await response.json();
                setTier(data);
            }
        } catch (error) {
            console.error('Balance check error:', error);
        } finally {
            setLoading(false);
        }
    }, [publicKey]);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (connected && publicKey) {
            checkBalance();
        } else {
            setTier(null);
        }
    }, [connected, publicKey, checkBalance]);

    if (!mounted) return <div className="h-64 w-full animate-pulse bg-white/5 rounded-xl"></div>;

    const tierColors: Record<TierLevel, string> = {
        none: 'text-gray-500',
        basic: 'text-blue-400',
        full: 'text-purple-400',
        god: 'text-neon-red',
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Access Card */}
            <div className="relative group max-w-md mx-auto mb-12" style={{ perspective: '1000px' }}>
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
                    <div className="mb-4 relative z-10">
                        <div className="text-[10px] text-gray-500 mb-2">IDENTITY_HASH</div>
                        <div className="bg-black/50 border border-white/5 p-3 font-mono text-xs text-white/70 tracking-widest break-all rounded relative overflow-hidden">
                            {connected && publicKey ? publicKey.toString() : 'NO_SIGNAL_FOUND // CONNECT_IMMEDIATELY'}
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-neon-red/50 animate-scanline"></div>
                        </div>
                    </div>

                    {/* Tier Display (when connected) */}
                    {connected && tier && (
                        <div className="mb-6 relative z-10 p-4 bg-black/30 border border-white/5 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-gray-500 font-mono">ACCESS_TIER</span>
                                <span className={`font-mono font-bold uppercase tracking-wider ${tierColors[tier.level]}`}>
                                    {tier.level === 'god' && '★ '}{TIER_CONFIGS[tier.level].name}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 font-mono">$REDPILL_BALANCE</span>
                                <span className="font-mono text-white font-bold">
                                    {loading ? '...' : formatTokens(tier.balance)}
                                </span>
                            </div>
                        </div>
                    )}

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

            {/* Tier Requirements Table */}
            <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                <h3 className="text-center font-mono text-xs text-neon-red tracking-[0.3em] mb-6 relative z-10">
                    {"// ACCESS_TIER_REQUIREMENTS"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    {(['basic', 'full', 'god'] as TierLevel[]).map((tierKey) => {
                        const config = TIER_CONFIGS[tierKey];
                        const isCurrentTier = tier?.level === tierKey;

                        return (
                            <div
                                key={tierKey}
                                className={`p-4 border rounded-lg transition-all ${
                                    isCurrentTier
                                        ? 'border-neon-red bg-neon-red/10'
                                        : 'border-white/10 bg-black/30 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`font-mono font-bold uppercase text-sm ${tierColors[tierKey]}`}>
                                        {tierKey === 'god' && '★ '}{config.name}
                                    </span>
                                    {isCurrentTier && (
                                        <span className="text-[8px] bg-neon-red text-black px-2 py-0.5 font-mono font-bold rounded">
                                            ACTIVE
                                        </span>
                                    )}
                                </div>

                                <div className="text-2xl font-bold font-mono text-white mb-3">
                                    {formatTokens(config.minTokens)}
                                    <span className="text-xs text-gray-500 ml-1">$REDPILL</span>
                                </div>

                                <ul className="space-y-1">
                                    {config.features.map((feature, idx) => (
                                        <li key={idx} className="text-[11px] text-gray-400 font-mono flex items-start gap-2">
                                            <span className="text-neon-green mt-0.5">›</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-[10px] text-gray-600 font-mono mt-6 relative z-10">
                    HOLD $REDPILL IN YOUR WALLET TO UNLOCK FEATURES // NO STAKING REQUIRED
                </p>
            </div>
        </div>
    );
}
