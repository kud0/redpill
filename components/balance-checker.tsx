'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TierLevel, UserTier } from '@/lib/types';
import TierBadge from './tier-badge';
import { formatTokenBalance } from '@/lib/solana';

export default function BalanceChecker() {
  const { publicKey, connected } = useWallet();
  const [tier, setTier] = useState<UserTier | null>(null);
  const [loading, setLoading] = useState(false);

  const checkBalance = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const response = await fetch('/api/check-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toString() }),
      });

      if (!response.ok) {
        throw new Error('Failed to check balance');
      }

      const data = await response.json();
      setTier(data);

      if (data.level === 'none') {
        toast.error('Insufficient $REDPILL balance. Get at least 500K tokens to access features.');
      } else {
        toast.success(`${data.level.toUpperCase()} tier unlocked!`);
      }
    } catch (error) {
      console.error('Balance check error:', error);
      toast.error('Failed to check balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      checkBalance();
    } else {
      setTier(null);
    }
  }, [connected, publicKey]);

  if (!connected) {
    return null;
  }

  return (
    <div className="mt-6 p-6 redpill-border rounded-lg bg-dark-400">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-redpill-500">Your Access Level</h3>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-redpill-500"></div>
        )}
      </div>

      {tier && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Balance:</span>
            <span className="text-2xl font-bold text-white">
              {formatTokenBalance(tier.balance)} $REDPILL
            </span>
          </div>

          <TierBadge level={tier.level} />

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Available Features:</h4>
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-400">
                  <svg
                    className="w-4 h-4 mr-2 text-redpill-500"
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
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={checkBalance}
            disabled={loading}
            className="w-full mt-4 px-4 py-2 bg-redpill-600 hover:bg-redpill-700 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
          >
            Refresh Balance
          </button>
        </div>
      )}
    </div>
  );
}
