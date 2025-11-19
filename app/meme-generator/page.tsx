'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import Image from 'next/image';

const memeTemplates = [
  'Drake Hotline Bling',
  'Distracted Boyfriend',
  'Two Buttons',
  'Expanding Brain',
  'Woman Yelling at Cat',
  'Always Has Been',
  'Is This a Pigeon?',
  'Change My Mind',
  'Pepe the Frog',
  'Wojak Crying',
];

export default function MemeGenerator() {
  const { publicKey, connected } = useWallet();
  const [template, setTemplate] = useState(memeTemplates[0]);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateMeme = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!topText && !bottomText) {
      toast.error('Please enter at least one text field');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          template,
          topText,
          bottomText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate meme');
      }

      const data = await response.json();
      setGeneratedMeme(data.imageUrl);
      toast.success('Meme generated successfully!');
    } catch (error: any) {
      console.error('Meme generation error:', error);
      toast.error(error.message || 'Failed to generate meme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Meme Generator
        </h1>
        <p className="text-xl text-gray-300">
          Create viral memes with AI-powered templates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="p-6 redpill-border rounded-lg bg-dark-400">
            <h2 className="text-xl font-semibold text-white mb-4">
              Meme Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-500 redpill-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-redpill-500"
                >
                  {memeTemplates.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Top Text
                </label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text..."
                  className="w-full px-4 py-3 bg-dark-500 redpill-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-redpill-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bottom Text
                </label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text..."
                  className="w-full px-4 py-3 bg-dark-500 redpill-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-redpill-500"
                />
              </div>

              <button
                onClick={generateMeme}
                disabled={loading || !connected}
                className="w-full px-6 py-4 bg-redpill-600 hover:bg-redpill-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed redpill-glow"
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
                    Generating...
                  </span>
                ) : (
                  'Generate Meme'
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
          <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
          <div className="aspect-square bg-dark-500 rounded-lg flex items-center justify-center overflow-hidden">
            {generatedMeme ? (
              <img
                src={generatedMeme}
                alt="Generated meme"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg
                  className="w-24 h-24 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p>Your meme will appear here</p>
              </div>
            )}
          </div>

          {generatedMeme && (
            <a
              href={generatedMeme}
              download="redpill-meme.png"
              className="mt-4 w-full inline-block text-center px-6 py-3 bg-dark-300 hover:bg-dark-200 text-white font-semibold rounded-lg transition-colors redpill-border"
            >
              Download Meme
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
