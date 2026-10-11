export type ThemePreset = 'obsidian' | 'emerald' | 'amethyst' | 'crimson' | 'solar' | 'daylight';
export type AccentColor = 'cyan' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'violet';
export type SurfaceMode = 'dark' | 'amoled' | 'light';

export type Structure3DType = 
  | 'atom'           // 3D Quantum Atomic Orbital Structure
  | 'helix'          // Academic Double Helix (Curriculum progression spiral)
  | 'constellation'  // Geodesic Neural Constellation (Peer & skill network)
  | 'orbit'          // Solar Gravitational Orbit (Risk-based planetary rings)
  | 'terrain'        // Topological Cyber Waveform (Performance terrain landscape)
  | 'radar';         // Cylindrical Radar Tower (Multi-tier semester column)

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  tagline: string;
  primaryAccent: AccentColor;
  defaultSurface: SurfaceMode;
  bgClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  textClass: string;
  textMutedClass: string;
  accentGradient: string;
  accentGlow: string;
  ambientOrbs: {
    orb1: string; // Tailwind gradient classes
    orb2: string;
    orb3: string;
    orb4: string;
  };
  threeJs: {
    fogColor: number;
    ambientColor: number;
    dirLight1: number;
    dirLight2: number;
    gridPrimary: number;
    gridSecondary: number;
    particleColor: number;
  };
}

export interface Structure3DMeta {
  id: Structure3DType;
  title: string;
  shortName: string;
  tagline: string;
  description: string;
  mathFormula: string;
  iconName: string;
  badgeColor: string;
  recommendedUse: string;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'ATOMIS Cyber Obsidian',
    tagline: 'Deep space obsidian with electric sapphire & cyan neon',
    primaryAccent: 'cyan',
    defaultSurface: 'dark',
    bgClass: 'bg-slate-950',
    cardBgClass: 'bg-slate-900/60',
    cardBorderClass: 'border-white/10',
    textClass: 'text-slate-100',
    textMutedClass: 'text-slate-400',
    accentGradient: 'from-cyan-500 via-indigo-600 to-purple-600',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    ambientOrbs: {
      orb1: 'from-cyan-500/20 via-blue-600/15 to-transparent',
      orb2: 'from-indigo-500/20 via-purple-600/15 to-transparent',
      orb3: 'from-fuchsia-600/15 via-rose-600/10 to-transparent',
      orb4: 'from-emerald-600/15 via-teal-600/10 to-transparent'
    },
    threeJs: {
      fogColor: 0x030712,
      ambientColor: 0xffffff,
      dirLight1: 0x6366f1,
      dirLight2: 0x06b6d4,
      gridPrimary: 0x3730a3,
      gridSecondary: 0x1e1b4b,
      particleColor: 0x818cf8
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Fintech & Growth',
    tagline: 'Deep jade forest with luminous mint & growth neon',
    primaryAccent: 'emerald',
    defaultSurface: 'dark',
    bgClass: 'bg-[#03150f]',
    cardBgClass: 'bg-[#06241a]/60',
    cardBorderClass: 'border-emerald-500/20',
    textClass: 'text-emerald-50',
    textMutedClass: 'text-emerald-400/70',
    accentGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    ambientOrbs: {
      orb1: 'from-emerald-500/25 via-teal-600/15 to-transparent',
      orb2: 'from-cyan-500/20 via-emerald-700/15 to-transparent',
      orb3: 'from-lime-500/15 via-emerald-600/10 to-transparent',
      orb4: 'from-teal-600/20 via-green-600/10 to-transparent'
    },
    threeJs: {
      fogColor: 0x03150f,
      ambientColor: 0xe6fffa,
      dirLight1: 0x10b981,
      dirLight2: 0x14b8a6,
      gridPrimary: 0x047857,
      gridSecondary: 0x064e3b,
      particleColor: 0x34d399
    }
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst Cosmic Nebula',
    tagline: 'Royal cosmic purple with ultraviolet glow & fuchsia highlights',
    primaryAccent: 'violet',
    defaultSurface: 'dark',
    bgClass: 'bg-[#090514]',
    cardBgClass: 'bg-[#130b29]/60',
    cardBorderClass: 'border-purple-500/20',
    textClass: 'text-purple-50',
    textMutedClass: 'text-purple-300/70',
    accentGradient: 'from-fuchsia-500 via-purple-600 to-indigo-600',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    ambientOrbs: {
      orb1: 'from-purple-500/25 via-indigo-600/20 to-transparent',
      orb2: 'from-fuchsia-600/20 via-pink-600/15 to-transparent',
      orb3: 'from-violet-500/20 via-purple-800/15 to-transparent',
      orb4: 'from-cyan-500/15 via-purple-600/10 to-transparent'
    },
    threeJs: {
      fogColor: 0x090514,
      ambientColor: 0xfdf4ff,
      dirLight1: 0xa855f7,
      dirLight2: 0xec4899,
      gridPrimary: 0x6b21a8,
      gridSecondary: 0x3b0764,
      particleColor: 0xc084fc
    }
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Apex & Sunset Flare',
    tagline: 'High-contrast ruby night with fiery ember & amber accents',
    primaryAccent: 'rose',
    defaultSurface: 'dark',
    bgClass: 'bg-[#120508]',
    cardBgClass: 'bg-[#220a10]/60',
    cardBorderClass: 'border-rose-500/20',
    textClass: 'text-rose-50',
    textMutedClass: 'text-rose-300/70',
    accentGradient: 'from-rose-500 via-red-600 to-amber-500',
    accentGlow: 'rgba(244, 63, 94, 0.4)',
    ambientOrbs: {
      orb1: 'from-rose-600/25 via-orange-600/15 to-transparent',
      orb2: 'from-red-500/20 via-amber-600/15 to-transparent',
      orb3: 'from-pink-600/15 via-rose-800/15 to-transparent',
      orb4: 'from-amber-500/15 via-red-700/10 to-transparent'
    },
    threeJs: {
      fogColor: 0x120508,
      ambientColor: 0xfff1f2,
      dirLight1: 0xf43f5e,
      dirLight2: 0xf59e0b,
      gridPrimary: 0x9f1239,
      gridSecondary: 0x4c0519,
      particleColor: 0xfb7185
    }
  },
  solar: {
    id: 'solar',
    name: 'Solar Topaz & Golden Executive',
    tagline: 'Executive dark bronze with radiant golden amber & warm titanium',
    primaryAccent: 'amber',
    defaultSurface: 'dark',
    bgClass: 'bg-[#100d05]',
    cardBgClass: 'bg-[#1e1709]/60',
    cardBorderClass: 'border-amber-500/20',
    textClass: 'text-amber-50',
    textMutedClass: 'text-amber-300/70',
    accentGradient: 'from-amber-400 via-yellow-500 to-orange-500',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    ambientOrbs: {
      orb1: 'from-amber-500/25 via-yellow-600/15 to-transparent',
      orb2: 'from-orange-500/20 via-amber-700/15 to-transparent',
      orb3: 'from-yellow-400/15 via-amber-800/15 to-transparent',
      orb4: 'from-emerald-500/15 via-amber-600/10 to-transparent'
    },
    threeJs: {
      fogColor: 0x100d05,
      ambientColor: 0xfffbeb,
      dirLight1: 0xf59e0b,
      dirLight2: 0xd97706,
      gridPrimary: 0xb45309,
      gridSecondary: 0x78350f,
      particleColor: 0xfcd34d
    }
  },
  daylight: {
    id: 'daylight',
    name: 'Clean Horizon & Arctic Daylight',
    tagline: 'Pristine daylight executive view with frosted white glass & sapphire ink',
    primaryAccent: 'indigo',
    defaultSurface: 'light',
    bgClass: 'bg-slate-100',
    cardBgClass: 'bg-white/80',
    cardBorderClass: 'border-slate-300/80',
    textClass: 'text-slate-900',
    textMutedClass: 'text-slate-600',
    accentGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
    accentGlow: 'rgba(37, 99, 235, 0.3)',
    ambientOrbs: {
      orb1: 'from-blue-400/25 via-cyan-300/20 to-transparent',
      orb2: 'from-indigo-400/20 via-sky-300/20 to-transparent',
      orb3: 'from-purple-300/15 via-blue-200/20 to-transparent',
      orb4: 'from-emerald-300/15 via-teal-200/15 to-transparent'
    },
    threeJs: {
      fogColor: 0xf1f5f9,
      ambientColor: 0xffffff,
      dirLight1: 0x2563eb,
      dirLight2: 0x0284c7,
      gridPrimary: 0x94a3b8,
      gridSecondary: 0xcbd5e1,
      particleColor: 0x3b82f6
    }
  }
};

export const STRUCTURE_CATALOG: Structure3DMeta[] = [
  {
    id: 'atom',
    title: '3D Quantum Atom Structure',
    shortName: 'Atom Structure',
    tagline: 'Multi-Planar Bohr-Rutherford Quantum Orbital Shells',
    description: 'A dynamic 3D atomic model featuring a dense, radiant academic core surrounded by multi-axis inclined electron orbital rings. Student nodes orbit along these quantum probability paths.',
    mathFormula: 'r = Shell(n) · [x, y, z] = Rot(inclination) · [a·cos(θ), b·sin(θ), 0]',
    iconName: 'Atom',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50',
    recommendedUse: 'Interactive atomic momentum visualization of student cohort distribution'
  },
  {
    id: 'helix',
    title: 'Academic Double Helix',
    shortName: 'Double Helix',
    tagline: 'Curriculum Progression & Genomic Learning Ribbon',
    description: 'Dual interwoven mathematical spirals representing students advancing through semester credits. Helical rungs link at-risk mentees with high-performing peer mentors.',
    mathFormula: 'x = R·cos(θ) · y = Pitch·θ · z = R·sin(θ) + Phase',
    iconName: 'Dna',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/50',
    recommendedUse: 'Tracking continuous academic trajectory & peer tutoring pairings'
  },
  {
    id: 'constellation',
    title: 'Neural Constellation Sphere',
    shortName: 'Neural Sphere',
    tagline: 'Interconnected Departmental Graph on a Geodesic Orb',
    description: 'Students mapped across a 3D spherical geodesic mesh. Glowing graph filaments connect students within the same cohort and shared skill benchmark levels.',
    mathFormula: 'x = R·sin(ϕ)·cos(θ) · y = R·cos(ϕ) · z = R·sin(ϕ)·sin(θ)',
    iconName: 'Share2',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50',
    recommendedUse: 'Analyzing peer support networks and department cohort density'
  },
  {
    id: 'orbit',
    title: 'Solar Gravitational Orbits',
    shortName: 'Solar Orbit',
    tagline: 'Concentric Planetary Bands of Institutional Risk',
    description: 'The center sun represents ATOMIS Career Readiness & Degree Conferral. 4 orbital gravity tracks arrange students from Critical Risk (inner ring) to Exemplary (outer crown orbit).',
    mathFormula: 'r = Radius(RiskLevel) · OrbitSpeed ∝ 1/√r',
    iconName: 'CircleDot',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/50',
    recommendedUse: 'Executive presentation of cohort risk distribution at a glance'
  },
  {
    id: 'terrain',
    title: 'Topological Cyber Waveform',
    shortName: 'Cyber Wave',
    tagline: 'Dynamic Academic Performance Elevation Landscape',
    description: 'Students elevated upon an undulating 3D matrix terrain mesh. High CGPA & engagement form luminous peaks, while critical backlogs rest in low valley channels.',
    mathFormula: 'y = sin(x·0.2 + t) · cos(z·0.2 + t) + Elevation(CGPA)',
    iconName: 'Activity',
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-950/50',
    recommendedUse: 'Visualizing campus-wide performance peaks and valley interventions'
  },
  {
    id: 'radar',
    title: 'Cylindrical Radar Tower',
    shortName: 'Radar Pillar',
    tagline: 'Multi-Floor Semester Column with 360° Sweep',
    description: 'A multi-tiered cylindrical hologram column. Vertical rings correspond to student academic years (Years 1-4), while radial distance reflects risk score with an active radar beam.',
    mathFormula: 'y = YearLevel · θ = DepartmentAngle · r = RiskScore',
    iconName: 'Compass',
    badgeColor: 'text-blue-400 border-blue-500/40 bg-blue-950/50',
    recommendedUse: 'Cross-year departmental comparisons and radar surveillance'
  }
];
