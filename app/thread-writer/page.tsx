'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

export default function ThreadWriter() {
  const { publicKey, connected } = useWallet();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'x' | 'warpcast' | 'lens'>('x');
  const [tone, setTone] = useState<'professional' | 'casual' | 'humorous'>('casual');
  const [length, setLength] = useState(5);
  const [thread, setThread] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  // Check access on mount and when wallet connects
  const checkAccess = async () => {
    if (!publicKey) {
      setHasAccess(false);
      return;
    }

    try {
      const response = await fetch('/api/check-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toString() }),
      });

      if (response.ok) {
        const data = await response.json();
        // Allow access if user has basic tier or higher
        setHasAccess(['basic', 'full', 'god'].includes(data.level));
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Access check error:', error);
      setHasAccess(false);
    }
  };

  // Check access when wallet connects
  if (connected && publicKey && !hasAccess && !loading) {
    checkAccess();
  }

  const writeThread = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/write-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          topic,
          platform,
          tone,
          length,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to write thread');
      }

      const data = await response.json();
      setThread(data.thread);
      toast.success('Thread generated successfully!');
    } catch (error: any) {
      console.error('Thread writing error:', error);
      toast.error(error.message || 'Failed to write thread');
    } finally {
      setLoading(false);
    }
  };

  const copyThread = () => {
    const text = thread.join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Thread copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Thread Writer
        </h1>
        <p className="text-xl text-gray-300">
          Write engaging threads for X, Warpcast, and Lens Protocol
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="p-6 redpill-border rounded-lg bg-dark-400">
            <h2 className="text-xl font-semibold text-white mb-4">
              Thread Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['x', 'warpcast', 'lens'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
                        platform === p
                          ? 'bg-redpill-600 text-white'
                          : 'bg-dark-500 text-gray-400 redpill-border hover:bg-dark-300'
                      }`}
                    >
                      {p === 'x' ? 'X/Twitter' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Topic
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What do you want to write about?"
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-500 redpill-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-redpill-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full px-4 py-3 bg-dark-500 redpill-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-redpill-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thread Length: {length} posts
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-dark-500 rounded-lg appearance-none cursor-pointer accent-redpill-600"
                />
              </div>

              <button
                onClick={writeThread}
                disabled={loading || !connected}
                className="w-full px-6 py-4 bg-redpill-600 hover:bg-redpill-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed redpill-glow"
                title={!connected ? 'Connect your wallet first' : !hasAccess ? 'Checking access...' : ''}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Writing...
                  </span>
                ) : (
                  'Write Thread'
                )}
              </button>
            </div>
          </div>

          <div className="p-4 redpill-border rounded-lg bg-dark-400">
            <p className="text-sm text-gray-400">
              <strong className="text-redpill-400">Tier Required:</strong> Basic (500K $REDPILL)
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="p-6 redpill-border rounded-lg bg-dark-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Generated Thread</h2>
            {thread.length > 0 && (
              <button
                onClick={copyThread}
                className="px-4 py-2 bg-dark-300 hover:bg-dark-200 text-white text-sm font-semibold rounded-lg transition-colors redpill-border"
              >
                Copy All
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {thread.length > 0 ? (
              thread.map((post, index) => (
                <div
                  key={index}
                  className="p-4 bg-dark-500 rounded-lg redpill-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-redpill-400 font-semibold">
                      Post {index + 1}/{thread.length}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(post);
                        toast.success(`Post ${index + 1} copied!`);
                      }}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-white whitespace-pre-wrap">{post}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <p>Your thread will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
