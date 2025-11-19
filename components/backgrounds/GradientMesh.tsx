'use client';

interface GradientMeshProps {
  className?: string;
}

export default function GradientMesh({ className = '' }: GradientMeshProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Blob 1 - Top Right */}
      <div
        className="absolute w-96 h-96 -top-48 -right-48 bg-redpill-600/30 rounded-full blur-3xl animate-blob"
        style={{ animationDelay: '0s' }}
      />

      {/* Blob 2 - Bottom Left */}
      <div
        className="absolute w-96 h-96 -bottom-48 -left-48 bg-redpill-500/20 rounded-full blur-3xl animate-blob"
        style={{ animationDelay: '2s' }}
      />

      {/* Blob 3 - Center */}
      <div
        className="absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-redpill-700/20 rounded-full blur-3xl animate-blob"
        style={{ animationDelay: '4s' }}
      />

      {/* Blob 4 - Top Left */}
      <div
        className="absolute w-72 h-72 top-1/4 left-1/4 bg-redpill-400/15 rounded-full blur-3xl animate-blob"
        style={{ animationDelay: '1s' }}
      />

      {/* Blob 5 - Bottom Right */}
      <div
        className="absolute w-72 h-72 bottom-1/4 right-1/4 bg-redpill-800/15 rounded-full blur-3xl animate-blob"
        style={{ animationDelay: '3s' }}
      />
    </div>
  );
}
