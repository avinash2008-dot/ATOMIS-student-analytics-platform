import React, { useState, useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'indigo' | 'rose' | 'cyan' | 'emerald' | 'amber';
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'indigo',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; // max 8 deg
    const rotateY = ((x - centerX) / centerX) * 8;

    setRotX(rotateX);
    setRotY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setIsHovered(false);
  };

  const getGlow = () => {
    switch (glowColor) {
      case 'rose': return '0 20px 40px -10px rgba(244, 63, 94, 0.35), 0 0 25px rgba(244, 63, 94, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)';
      case 'cyan': return '0 20px 40px -10px rgba(6, 182, 212, 0.35), 0 0 25px rgba(6, 182, 212, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)';
      case 'emerald': return '0 20px 40px -10px rgba(16, 185, 129, 0.35), 0 0 25px rgba(16, 185, 129, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)';
      case 'amber': return '0 20px 40px -10px rgba(245, 158, 11, 0.35), 0 0 25px rgba(245, 158, 11, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)';
      default: return '0 20px 40px -10px rgba(99, 102, 241, 0.35), 0 0 25px rgba(99, 102, 241, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease-out',
        boxShadow: isHovered ? getGlow() : '0 12px 30px -5px rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
        transformStyle: 'preserve-3d'
      }}
      className={`relative rounded-2xl backdrop-blur-2xl transition-all cursor-pointer ${className}`}
    >
      {/* 3D Specular Highlight Sheen */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at 50% 0%, rgba(255, 255, 255, 0.15), transparent 70%)`
        }}
      />
      {children}
    </div>
  );
};
