'use client';

import MemeIcon from './MemeIcon';
import ImageIcon from './ImageIcon';
import ThreadIcon from './ThreadIcon';
import VoiceIcon from './VoiceIcon';
import VocalRemoverIcon from './VocalRemoverIcon';

/**
 * IconShowcase - Demo component to display all premium icons
 * Use this for testing and showcasing the icon collection
 */
export default function IconShowcase() {
  const icons = [
    { name: 'Meme Generator', Component: MemeIcon, description: 'Viral spread energy' },
    { name: 'Image Generator', Component: ImageIcon, description: 'AI-powered layers' },
    { name: 'Thread Writer', Component: ThreadIcon, description: 'Network flow' },
    { name: 'Voice Cloner', Component: VoiceIcon, description: 'Audio waves' },
    { name: 'Vocal Remover', Component: VocalRemoverIcon, description: 'Stem separation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">
          Premium Icons
        </h1>
        <p className="text-gray-400 text-center mb-12 text-lg">
          Custom SVG icons with animations and glow effects
        </p>

        {/* Grid showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {icons.map(({ name, Component, description }) => (
            <div
              key={name}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-redpill-500/50 transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <Component size={80} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">
                {name}
              </h3>
              <p className="text-gray-400 text-sm text-center">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Size variations */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Size Variations</h2>

          {icons.map(({ name, Component }) => (
            <div key={name} className="mb-12 last:mb-0">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">{name}</h3>
              <div className="flex items-center gap-8 flex-wrap">
                <div className="text-center">
                  <Component size={32} />
                  <p className="text-gray-500 text-xs mt-2">32px</p>
                </div>
                <div className="text-center">
                  <Component size={48} />
                  <p className="text-gray-500 text-xs mt-2">48px</p>
                </div>
                <div className="text-center">
                  <Component size={64} />
                  <p className="text-gray-500 text-xs mt-2">64px</p>
                </div>
                <div className="text-center">
                  <Component size={80} />
                  <p className="text-gray-500 text-xs mt-2">80px</p>
                </div>
                <div className="text-center">
                  <Component size={96} />
                  <p className="text-gray-500 text-xs mt-2">96px</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All together */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Complete Set</h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {icons.map(({ name, Component }) => (
              <div key={name} className="text-center">
                <Component size={72} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
