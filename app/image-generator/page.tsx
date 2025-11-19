'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

export default function ImageGenerator() {
  const { publicKey, connected } = useWallet();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<'flux-pro' | 'sd3-medium'>('flux-pro');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          prompt,
          model,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      toast.success('Image generated successfully!');
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Image Generator
        </h1>
        <p className="text-xl text-gray-300">
          Create stunning images with Flux.1 Pro and SD3 Medium
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="p-6 redpill-border rounded-lg bg-dark-400">
            <h2 className="text-xl font-semibold text-white mb-4">
              Generation Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setModel('flux-pro')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      model === 'flux-pro'
                        ? 'bg-redpill-600 text-white redpill-glow'
                        : 'bg-dark-500 text-gray-400 redpill-border hover:bg-dark-300'
                    }`}
                  >
                    Flux.1 Pro
                  </button>
                  <button
                    onClick={() => setModel('sd3-medium')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      model === 'sd3-medium'
                        ? 'bg-redpill-600 text-white redpill-glow'
                        : 'bg-dark-500 text-gray-400 redpill-border hover:bg-dark-300'
                    }`}
                  >
                    SD3 Medium
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {model === 'flux-pro'
                    ? 'Flux.1 Pro: Highest quality, photorealistic (Full tier required)'
                    : 'SD3 Medium: Fast, versatile (Basic tier required)'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-500 redpill-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-redpill-500 resize-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Be specific and descriptive for best results
                </p>
              </div>

              <button
                onClick={generateImage}
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
                  'Generate Image'
                )}
              </button>
            </div>
          </div>

          <div className="p-4 redpill-border rounded-lg bg-dark-400">
            <p className="text-sm text-gray-400">
              <strong className="text-redpill-400">Tier Required:</strong>{' '}
              {model === 'flux-pro' ? 'Full (2M $REDPILL)' : 'Basic (500K $REDPILL)'}
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="p-6 redpill-border rounded-lg bg-dark-400">
          <h2 className="text-xl font-semibold text-white mb-4">Generated Image</h2>
          <div className="aspect-square bg-dark-500 rounded-lg flex items-center justify-center overflow-hidden">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated image"
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
                <p>Your image will appear here</p>
              </div>
            )}
          </div>

          {generatedImage && (
            <a
              href={generatedImage}
              download="redpill-image.png"
              className="mt-4 w-full inline-block text-center px-6 py-3 bg-dark-300 hover:bg-dark-200 text-white font-semibold rounded-lg transition-colors redpill-border"
            >
              Download Image
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
