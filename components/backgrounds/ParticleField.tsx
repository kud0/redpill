'use client';

interface ParticleFieldProps {
  className?: string;
}

export default function ParticleField({ className = '' }: ParticleFieldProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Simplified particle effect using CSS */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-1 h-1 bg-redpill-500 rounded-full animate-float" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
        <div className="absolute w-1 h-1 bg-redpill-400 rounded-full animate-float" style={{ top: '40%', left: '30%', animationDelay: '1s' }} />
        <div className="absolute w-2 h-2 bg-redpill-600 rounded-full animate-float" style={{ top: '60%', left: '50%', animationDelay: '2s' }} />
        <div className="absolute w-1 h-1 bg-redpill-500 rounded-full animate-float" style={{ top: '80%', left: '70%', animationDelay: '3s' }} />
        <div className="absolute w-1 h-1 bg-redpill-400 rounded-full animate-float" style={{ top: '30%', left: '80%', animationDelay: '4s' }} />
        <div className="absolute w-2 h-2 bg-redpill-500 rounded-full animate-float" style={{ top: '50%', left: '20%', animationDelay: '1.5s' }} />
        <div className="absolute w-1 h-1 bg-redpill-600 rounded-full animate-float" style={{ top: '70%', left: '90%', animationDelay: '2.5s' }} />
        <div className="absolute w-1 h-1 bg-redpill-400 rounded-full animate-float" style={{ top: '10%', left: '60%', animationDelay: '3.5s' }} />
      </div>
    </div>
  );
}
