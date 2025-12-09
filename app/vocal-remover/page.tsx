'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

export default function VocalRemover() {
  const { publicKey, connected } = useWallet();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'wav' | 'mp3'>('wav');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setAudioFile(file);
      toast.success('Audio file uploaded');
    }
  };

  const splitStems = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!audioFile) {
      toast.error('Please upload an audio file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('wallet', publicKey.toString());
      formData.append('audio', audioFile);
      formData.append('format', format);

      const response = await fetch('/api/split-stems', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to split stems');
      }

      const result = await response.json();
      toast.success('Stems split successfully!');

      // Set the result URLs for download
      if (result.vocals || result.instrumental) {
        console.debug('Stems ready:', Object.keys(result));
      }
    } catch (error: any) {
      console.error('Stem splitting error:', error);
      toast.error(error.message || 'Failed to split stems');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Vocal Remover
        </h1>
        <p className="text-xl text-gray-300">
          Split audio into stems: vocals, instrumental, drums, bass
        </p>
      </div>

      <div className="p-8 redpill-border rounded-lg bg-dark-400 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Audio File
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
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span className="text-white font-semibold mb-2">
                {audioFile ? audioFile.name : 'Click to upload audio'}
              </span>
              <span className="text-sm text-gray-400">
                MP3, WAV, FLAC, or M4A (50MB max)
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Output Format
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormat('wav')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                format === 'wav'
                  ? 'bg-redpill-600 text-white redpill-glow'
                  : 'bg-dark-500 text-gray-400 redpill-border hover:bg-dark-300'
              }`}
            >
              WAV (Lossless)
            </button>
            <button
              onClick={() => setFormat('mp3')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                format === 'mp3'
                  ? 'bg-redpill-600 text-white redpill-glow'
                  : 'bg-dark-500 text-gray-400 redpill-border hover:bg-dark-300'
              }`}
            >
              MP3 (Compressed)
            </button>
          </div>
        </div>

        <button
          onClick={splitStems}
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
              Processing Audio...
            </span>
          ) : (
            'Split into Stems'
          )}
        </button>

        <div className="p-4 redpill-border rounded-lg bg-dark-500">
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-redpill-400">Tier Required:</strong> Full (2M $REDPILL)
          </p>
          <p className="text-xs text-gray-500">
            Note: This feature is coming soon and will use advanced AI models for stem separation.
          </p>
        </div>
      </div>

      {/* Output Preview */}
      <div className="mt-8 p-6 redpill-border rounded-lg bg-dark-400">
        <h2 className="text-xl font-semibold text-white mb-4">Output Stems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Vocals', 'Instrumental', 'Drums', 'Bass'].map((stem) => (
            <div
              key={stem}
              className="p-4 bg-dark-500 rounded-lg redpill-border flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-redpill-600/20 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-redpill-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <span className="text-white font-semibold">{stem}</span>
              </div>
              <button
                disabled
                className="px-3 py-1 bg-dark-300 text-gray-500 rounded text-sm font-semibold cursor-not-allowed"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-6 redpill-border rounded-lg bg-dark-400">
        <h2 className="text-xl font-semibold text-white mb-4">What You&apos;ll Get</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <svg
              className="w-5 h-5 mr-3 text-redpill-500 mt-0.5 flex-shrink-0"
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
            <span><strong>Vocals:</strong> Isolated vocal track with minimal background</span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 mr-3 text-redpill-500 mt-0.5 flex-shrink-0"
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
            <span><strong>Instrumental:</strong> Full backing track without vocals</span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 mr-3 text-redpill-500 mt-0.5 flex-shrink-0"
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
            <span><strong>Drums:</strong> Isolated percussion and drum elements</span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 mr-3 text-redpill-500 mt-0.5 flex-shrink-0"
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
            <span><strong>Bass:</strong> Isolated bass line and low-frequency elements</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
