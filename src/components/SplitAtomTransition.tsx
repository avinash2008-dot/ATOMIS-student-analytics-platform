import React from 'react';

interface SplitAtomTransitionProps {
  scrollProgress: number; // 0 to 1
}

export const SplitAtomTransition: React.FC<SplitAtomTransitionProps> = ({ scrollProgress }) => {
  // Calculate parting kinematics
  // 0 -> 1 over the initial scroll zone (0.0 to 0.42)
  const splitFactor = Math.min(scrollProgress * 2.4, 1);
  const splitDistance = splitFactor * 220; // px displacement
  const splitRotation = splitFactor * 15; // deg rotation
  
  // Energy discharge peaks during mid-split (around 0.15 - 0.25 scroll)
  const energyGlow = Math.sin(splitFactor * Math.PI);
  
  // Overall visibility: visible at top, parts during scroll, gracefully fades into 3D background once fully parted
  const overallOpacity = Math.max(1 - (scrollProgress - 0.3) * 2.2, 0);

  if (overallOpacity <= 0.02) return null;

  return (
    <div
      className="fixed inset-0 lg:left-64 flex items-center justify-center pointer-events-none z-[1] overflow-hidden transition-opacity duration-300"
      style={{ opacity: overallOpacity }}
      aria-hidden="true"
    >
      {/* Central Quantum Cleavage Energy Discharge (appears during the parting split) */}
      <div
        className="absolute w-1.5 h-96 bg-gradient-to-b from-transparent via-cyan-300 to-transparent blur-[3px] transition-all duration-150"
        style={{
          opacity: energyGlow * 0.9,
          transform: `scaleY(${1 + splitFactor * 1.5}) scaleX(${1 + energyGlow * 3})`,
          boxShadow: '0 0 45px #38bdf8, 0 0 90px #06b6d4',
        }}
      />
      <div
        className="absolute w-32 h-32 rounded-full bg-cyan-400/30 blur-2xl transition-all duration-150"
        style={{
          opacity: energyGlow * 0.85,
          transform: `scale(${0.5 + splitFactor * 2.2})`,
        }}
      />

      {/* SVG Containing the Parting Atom Graphic */}
      <svg
        viewBox="0 0 500 500"
        className="w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] max-w-full drop-shadow-[0_0_35px_rgba(34,211,238,0.4)]"
      >
        <defs>
          <linearGradient id="split-cyan-teal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ff5ee" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <radialGradient id="split-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#67e8f9" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#082b4a" />
          </radialGradient>

          {/* Left Hemisphere Clip Path */}
          <clipPath id="left-hemisphere-clip">
            <rect x="0" y="0" width="250" height="500" />
          </clipPath>

          {/* Right Hemisphere Clip Path */}
          <clipPath id="right-hemisphere-clip">
            <rect x="250" y="0" width="250" height="500" />
          </clipPath>
        </defs>

        {/* ========================================================
            LEFT HALF OF PARTING ATOM GRAPHIC
            Displaces to the left & rotates outward
            ======================================================== */}
        <g
          clipPath="url(#left-hemisphere-clip)"
          style={{
            transform: `translateX(-${splitDistance}px) rotate(-${splitRotation}deg)`,
            transformOrigin: '250px 250px',
            transition: 'transform 0.12s ease-out',
          }}
        >
          {/* Outer Cyan Ring - Left Arc */}
          <circle
            cx="250"
            cy="250"
            r="190"
            stroke="url(#split-cyan-teal)"
            strokeWidth="5"
            fill="none"
            opacity="0.85"
          />
          <circle
            cx="250"
            cy="250"
            r="140"
            stroke="url(#split-cyan-teal)"
            strokeWidth="3"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.5"
          />

          {/* Orbit 1: Tilted -35 deg */}
          <g transform="rotate(-35 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="55"
              ry="145"
              stroke="url(#split-cyan-teal)"
              strokeWidth="9"
              fill="none"
              opacity="0.9"
            />
            <circle cx="250" cy="105" r="14" fill="#ffffff" filter="drop-shadow(0 0 8px #38bdf8)" />
          </g>

          {/* Orbit 2: Tilted +35 deg */}
          <g transform="rotate(35 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="55"
              ry="145"
              stroke="url(#split-cyan-teal)"
              strokeWidth="9"
              fill="none"
              opacity="0.9"
            />
          </g>

          {/* Orbit 3: Horizontal 90 deg */}
          <g transform="rotate(90 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="55"
              ry="145"
              stroke="url(#split-cyan-teal)"
              strokeWidth="9"
              fill="none"
              opacity="0.9"
            />
            <circle cx="250" cy="105" r="14" fill="#67e8f9" filter="drop-shadow(0 0 8px #38bdf8)" />
          </g>

          {/* Glowing Nucleus - Left Half */}
          <circle cx="250" cy="250" r="44" fill="url(#split-core-glow)" />
          <circle cx="238" cy="238" r="9" fill="#ffffff" opacity="0.85" />
        </g>

        {/* ========================================================
            RIGHT HALF OF PARTING ATOM GRAPHIC
            Displaces to the right & rotates outward
            ======================================================== */}
        <g
          clipPath="url(#right-hemisphere-clip)"
          style={{
            transform: `translateX(${splitDistance}px) rotate(${splitRotation}deg)`,
            transformOrigin: '250px 250px',
            transition: 'transform 0.12s ease-out',
          }}
        >
          {/* Outer Cyan Ring - Right Arc */}
          <circle
            cx="250"
            cy="250"
            r="190"
            stroke="url(#split-cyan-teal)"
            strokeWidth="5"
            fill="none"
            opacity="0.85"
          />
          <circle
            cx="250"
            cy="250"
            r="140"
            stroke="url(#split-cyan-teal)"
            strokeWidth="3"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.5"
          />

          {/* Orbit 1: Tilted -35 deg */}
          <g transform="rotate(-35 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="55"
              ry="145"
              stroke="url(#split-cyan-teal)"
              strokeWidth="9"
              fill="none"
              opacity="0.9"
            />
          </g>

          {/* Orbit 2: Tilted +35 deg */}
          <g transform="rotate(35 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="55"
              ry="145"
              stroke="url(#split-cyan-teal)"
              strokeWidth="9"
              fill="none"
              opacity="0.9"
            />
            <circle cx="250" cy="395" r="14" fill="#ffffff" filter="drop-shadow(0 0 8px #38bdf8)" />
          </g>

          {/* Orbit 3: Horizontal 90 deg */}
          <g transform="rotate(90 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="55"
              ry="145"
              stroke="url(#split-cyan-teal)"
              strokeWidth="9"
              fill="none"
              opacity="0.9"
            />
          </g>

          {/* Glowing Nucleus - Right Half */}
          <circle cx="250" cy="250" r="44" fill="url(#split-core-glow)" />
        </g>
      </svg>
    </div>
  );
};
