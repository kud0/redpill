'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

export default function VoiceCloner() {
  const { publicKey, connected } = useWallet();
  const [text, setText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setAudioFile(file);
      toast.success('Audio file uploaded');
    }
  };

  const cloneVoice = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!audioFile) {
      toast.error('Please upload an audio file');
      return;
    }

    if (!text.trim()) {
      toast.error('Please enter text to synthesize');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('wallet', publicKey.toString());
      formData.append('audio', audioFile);
      formData.append('text', text);

      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to clone voice');
      }

      const data = await response.json();
      toast.success('Voice cloned successfully!');

      // Handle the cloned audio response
      // This would typically be an audio URL or base64 data
    } catch (error: any) {
      console.error('Voice cloning error:', error);
      toast.error(error.message || 'Failed to clone voice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Voice Cloner
        </h1>
        <p className="text-xl text-gray-300">
          Clone any voice with just 10 seconds of audio
        </p>
      </div>

      <div className="p-8 redpill-border rounded-lg bg-dark-400 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Step 1: Upload Voice Sample
          </label>
          <div className="border-2 border-dashed redpill-border rounded-lg p-8 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              <svg
                className="w-16 h-16 text-redpill-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-white font-semibold mb-2">
                {audioFile ? audioFile.name : 'Click to upload audio'}
              </span>
              <span className="text-sm text-gray-400">
                MP3, WAV, or M4A (10 seconds minimum, 10MB max)
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Step 2: Enter Text to Synthesize
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to speak in the cloned voice..."
            rows={6}
            className="w-full px-4 py-3 bg-dark-500 redpill-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-redpill-500 resize-none"
          />
        </div>

        <button
          onClick={cloneVoice}
          disabled={loading || !connected || !audioFile}
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
              Cloning Voice...
            </span>
          ) : (
            'Clone Voice'
          )}
        </button>

        <div className="p-4 redpill-border rounded-lg bg-dark-500">
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-redpill-400">Tier Required:</strong> Full (2M $REDPILL)
          </p>
          <p className="text-xs text-gray-500">
            Note: This feature is coming soon and will integrate with leading TTS providers.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-12 p-6 redpill-border rounded-lg bg-dark-400">
        <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
        <ol className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-sm font-bold text-white bg-redpill-600 rounded-full flex-shrink-0">
              1
            </span>
            <span>Upload a clear 10+ second audio sample of the voice you want to clone</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-sm font-bold text-white bg-redpill-600 rounded-full flex-shrink-0">
              2
            </span>
            <span>Enter the text you want the cloned voice to speak</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-sm font-bold text-white bg-redpill-600 rounded-full flex-shrink-0">
              3
            </span>
            <span>Our AI analyzes the voice characteristics and generates speech</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-sm font-bold text-white bg-redpill-600 rounded-full flex-shrink-0">
              4
            </span>
            <span>Download your cloned voice audio file</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
