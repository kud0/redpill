'use client';

interface DepthLayerProps {
  className?: string;
}

export default function DepthLayer({ className = '' }: DepthLayerProps) {
  return (
    <div className={`depth-ambient ${className}`}>
      {/* Slow-moving ambient glow spots */}
      <div className="ambient-glow-1" style={{ top: '20%', left: '70%' }} />
      <div className="ambient-glow-2" style={{ bottom: '30%', left: '20%' }} />
      <div className="ambient-glow-3" style={{ top: '50%', right: '15%' }} />
    </div>
  );
}
