import React from 'react';

export interface AtomisLogoProps {
  variant?: 'badge' | 'icon' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
  textClassName?: string;
  taglineClassName?: string;
  transparentBg?: boolean;
}

export const AtomisLogo: React.FC<AtomisLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  withText = true,
  showTagline = true,
  animated = false,
  layout = 'horizontal',
  className = '',
  textClassName = '',
  taglineClassName = '',
  transparentBg = true,
}) => {
  // Sizing definitions
  const badgeSizeMap = {
    sm: { px: 44, textName: 'text-base', textTagline: 'text-[9px]' },
    md: { px: 64, textName: 'text-xl', textTagline: 'text-[10px]' },
    lg: { px: 110, textName: 'text-2xl', textTagline: 'text-[11px]' },
    xl: { px: 180, textName: 'text-4xl', textTagline: 'text-xs' },
  };

  const iconSizeMap = {
    sm: { px: 28, textName: 'text-base', textTagline: 'text-[9px]' },
    md: { px: 38, textName: 'text-xl', textTagline: 'text-[10px]' },
    lg: { px: 56, textName: 'text-2xl', textTagline: 'text-[11px]' },
    xl: { px: 84, textName: 'text-4xl', textTagline: 'text-xs' },
  };

  const currentSize = variant === 'badge' ? badgeSizeMap[size] : iconSizeMap[size];

  // Standalone Atom Core SVG (used for icon variant or within badge)
  const renderAtomCore = (isWithinBadge = false) => {
    return (
      <g className={animated ? 'atomis-logo-animated' : ''}>
        <defs>
          {/* Cyan to teal gradient */}
          <linearGradient id="atomis-cyan-teal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ff5ee" />
            <stop offset="50%" stopColor="#3fd0e6" />
            <stop offset="100%" stopColor="#1f9fd8" />
          </linearGradient>

          {/* Nucleus Glow & Gloss */}
          <radialGradient id="atomis-core-glow" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#7ff5ee" />
            <stop offset="70%" stopColor="#1f9fd8" />
            <stop offset="100%" stopColor="#082b4a" />
          </radialGradient>

          <radialGradient id="atomis-sphere-glow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#7ff5ee" />
            <stop offset="100%" stopColor="#1f9fd8" />
          </radialGradient>
        </defs>

        {/* Orbit 1: ~-35 degrees */}
        <g transform="rotate(-35 120 120)">
          <ellipse
            cx="120"
            cy="120"
            rx="34"
            ry="92"
            stroke="url(#atomis-cyan-teal)"
            strokeWidth={isWithinBadge ? '8' : '9'}
            fill="none"
            opacity="0.95"
          />
          {/* Orbit sphere */}
          <circle cx="120" cy="28" r="9" fill="url(#atomis-sphere-glow)" className="drop-shadow-sm" />
        </g>

        {/* Orbit 2: ~35 degrees */}
        <g transform="rotate(35 120 120)">
          <ellipse
            cx="120"
            cy="120"
            rx="34"
            ry="92"
            stroke="url(#atomis-cyan-teal)"
            strokeWidth={isWithinBadge ? '8' : '9'}
            fill="none"
            opacity="0.95"
          />
          {/* Orbit sphere */}
          <circle cx="120" cy="212" r="9" fill="url(#atomis-sphere-glow)" className="drop-shadow-sm" />
        </g>

        {/* Orbit 3: ~90 degrees (Horizontal) */}
        <g transform="rotate(90 120 120)">
          <ellipse
            cx="120"
            cy="120"
            rx="34"
            ry="92"
            stroke="url(#atomis-cyan-teal)"
            strokeWidth={isWithinBadge ? '8' : '9'}
            fill="none"
            opacity="0.9"
          />
          {/* Orbit sphere */}
          <circle cx="120" cy="28" r="9" fill="url(#atomis-sphere-glow)" className="drop-shadow-sm" />
        </g>

        {/* Center Glowing Nucleus */}
        <circle cx="120" cy="120" r="28" fill="url(#atomis-core-glow)" className="drop-shadow-md" />
        {/* Soft center shine dot */}
        <circle cx="112" cy="112" r="6" fill="#ffffff" opacity="0.8" />
      </g>
    );
  };

  // 1. BADGE VARIANT: Circular badge with curved text and cyan outer ring
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ width: currentSize.px, height: currentSize.px }}
      >
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full overflow-visible drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="badge-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ff5ee" />
              <stop offset="50%" stopColor="#3fd0e6" />
              <stop offset="100%" stopColor="#1f9fd8" />
            </linearGradient>

            <radialGradient id="badge-bg-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0b1736" />
              <stop offset="85%" stopColor="#060a2c" />
              <stop offset="100%" stopColor="#030517" />
            </radialGradient>

            {/* Top arc for ATOMIS: sweeps left to right along top */}
            {/* Center (160, 160), radius ~126 */}
            <path
              id="top-text-arc"
              d="M 40 160 A 120 120 0 0 1 280 160"
              fill="none"
            />

            {/* Bottom arc for PREDICT. SUPPORT. SUCCEED.
                Drawn counter-clockwise from right to left so normal LTR text appears upright at the bottom */}
            <path
              id="bottom-text-arc"
              d="M 284 160 A 124 124 0 0 1 36 160"
              fill="none"
            />
          </defs>

          {/* Background circle */}
          {!transparentBg && (
            <circle cx="160" cy="160" r="156" fill="url(#badge-bg-radial)" stroke="#1a2d54" strokeWidth="2" />
          )}

          {/* Outer Decorative Dual Rings */}
          <circle
            cx="160"
            cy="160"
            r="152"
            stroke="url(#badge-ring-gradient)"
            strokeWidth="3.5"
            strokeOpacity="0.85"
          />
          <circle
            cx="160"
            cy="160"
            r="104"
            stroke="url(#badge-ring-gradient)"
            strokeWidth="2"
            strokeOpacity="0.45"
            strokeDasharray="4 3"
          />

          {/* Outer Ring Accent Spheres */}
          <circle cx="160" cy="8" r="5" fill="#7ff5ee" />
          <circle cx="312" cy="160" r="4.5" fill="#3fd0e6" />
          <circle cx="8" cy="160" r="4.5" fill="#1f9fd8" />
          <circle cx="160" cy="312" r="5" fill="#7ff5ee" />

          {/* TOP CURVED TEXT: "ATOMIS" - Bell MT classic serif (Richard Austin, 1788) */}
          <text
            className="fill-white font-['Bell_MT'] font-black uppercase"
            style={{
              fontFamily: "'Bell MT', 'Bell', 'Didot', 'Bodoni MT', 'Baskerville', 'Georgia', serif",
              fontSize: '28px',
              letterSpacing: '0.28em',
              fontWeight: 900,
            }}
          >
            <textPath
              href="#top-text-arc"
              startOffset="50%"
              textAnchor="middle"
              className="fill-white drop-shadow"
            >
              ATOMIS
            </textPath>
          </text>

          {/* SIDE YEAR NUMBERS: "20" (Left) and "26" (Right) */}
          <text
            x="44"
            y="166"
            textAnchor="middle"
            fill="#7ff5ee"
            style={{
              fontFamily: "'Bell MT', 'Bell', 'Didot', 'Bodoni MT', 'Baskerville', 'Georgia', serif",
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}
          >
            20
          </text>
          <text
            x="276"
            y="166"
            textAnchor="middle"
            fill="#7ff5ee"
            style={{
              fontFamily: "'Bell MT', 'Bell', 'Didot', 'Bodoni MT', 'Baskerville', 'Georgia', serif",
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}
          >
            26
          </text>

          {/* BOTTOM CURVED TEXT: "PREDICT. SUPPORT. SUCCEED." */}
          <text
            className="fill-cyan-300 font-['Quicksand'] font-bold uppercase"
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: '13.5px',
              letterSpacing: '0.28em',
              fontWeight: 700,
              fill: '#7ff5ee',
            }}
          >
            <textPath
              href="#bottom-text-arc"
              startOffset="50%"
              textAnchor="middle"
            >
              PREDICT. SUPPORT. SUCCEED.
            </textPath>
          </text>

          {/* Center Atom (scaled and centered inside 320x320, standard atom is 240x240) */}
          <g transform="translate(56, 56) scale(0.866)">
            {renderAtomCore(true)}
          </g>
        </svg>
      </div>
    );
  }

  // 2. ICON VARIANT: Pure atom inside the cyan circular ring
  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ width: currentSize.px, height: currentSize.px }}
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full overflow-visible drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer bounding accent ring */}
          <circle
            cx="120"
            cy="120"
            r="114"
            stroke="url(#atomis-cyan-teal)"
            strokeWidth="3"
            strokeOpacity="0.4"
          />
          {renderAtomCore(false)}
        </svg>
      </div>
    );
  }

  // 3. HORIZONTAL VARIANT: Atom icon on left, live HTML text on right
  return (
    <div
      className={`inline-flex items-center ${
        layout === 'vertical' ? 'flex-col text-center gap-2' : 'gap-3'
      } ${className}`}
    >
      {/* Icon Mark */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: currentSize.px, height: currentSize.px }}
      >
        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-sm"
        >
          <circle
            cx="120"
            cy="120"
            r="114"
            stroke="url(#atomis-cyan-teal)"
            strokeWidth="2.5"
            strokeOpacity="0.5"
          />
          {renderAtomCore(false)}
        </svg>
      </div>

      {/* Live HTML Branding Text */}
      {withText && (
        <div className={`flex flex-col leading-none select-none ${textClassName}`}>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-wider uppercase text-slate-900 dark:text-white ${currentSize.textName}`}
              style={{
                fontFamily: "'Bell MT', 'Bell', 'Didot', 'Bodoni MT', 'Baskerville', 'Georgia', serif",
                letterSpacing: '0.08em',
              }}
              title="Atomis — Bell MT (punchcutter Richard Austin, 1788, John Bell's British Letter Foundry)"
            >
              ATOMIS
            </span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 leading-none"
              style={{
                fontFamily: "'Bell MT', 'Bell', 'Georgia', serif",
              }}
            >
              2026
            </span>
          </div>
          {showTagline && (
            <span
              className={`font-bold uppercase text-slate-500 dark:text-cyan-400/80 mt-1 ${currentSize.textTagline} ${taglineClassName}`}
              style={{
                fontFamily: "'Quicksand', sans-serif",
                letterSpacing: '0.28em',
              }}
            >
              PREDICT. SUPPORT. SUCCEED.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
