import React from 'react';

/**
 * High-Contrast Theme System for Atomis Dashboard
 * 
 * Provides both CSS-in-JS style objects (React.CSSProperties) and calibrated
 * Tailwind classes specifically tuned for Light Mode to eliminate glare on white/light
 * surfaces, ensuring WCAG AA compliant contrast ratios and solid, grounded background weights.
 */

// ============================================================================
// 1. CSS-in-JS STYLE OBJECTS (React.CSSProperties)
// ============================================================================

export interface DashboardThemeStyles {
  cards: {
    base: React.CSSProperties;
    elevated: React.CSSProperties;
    accent: React.CSSProperties;
    title: React.CSSProperties;
    subtitle: React.CSSProperties;
    body: React.CSSProperties;
    metricNumber: React.CSSProperties;
    metricLabel: React.CSSProperties;
    badgeSuccess: React.CSSProperties;
    badgeWarning: React.CSSProperties;
    badgeDanger: React.CSSProperties;
    badgeNeutral: React.CSSProperties;
  };
  headers: {
    pageHeader: React.CSSProperties;
    title: React.CSSProperties;
    subtitle: React.CSSProperties;
    topBar: React.CSSProperties;
    brandTitle: React.CSSProperties;
    brandSubtitle: React.CSSProperties;
    sectionTitle: React.CSSProperties;
  };
  navigation: {
    sidebar: React.CSSProperties;
    itemActive: React.CSSProperties;
    itemInactive: React.CSSProperties;
    iconActive: React.CSSProperties;
    iconInactive: React.CSSProperties;
    filterSelect: React.CSSProperties;
    roleSwitcher: React.CSSProperties;
    userCard: React.CSSProperties;
    activeScopeBadge: React.CSSProperties;
  };
  tables: {
    wrapper: React.CSSProperties;
    thead: React.CSSProperties;
    th: React.CSSProperties;
    trHover: React.CSSProperties;
    tdPrimary: React.CSSProperties;
    tdSecondary: React.CSSProperties;
    border: React.CSSProperties;
  };
}

/**
 * Dedicated high-contrast CSS-in-JS style object for Light Mode
 */
export const lightModeDashboardStyles: DashboardThemeStyles = {
  cards: {
    base: {
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1', // slate-300: crisp visual separation
      borderRadius: '1rem',
      boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
      color: '#0f172a', // slate-900: deep readable ink
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    elevated: {
      backgroundColor: '#ffffff',
      border: '1px solid #94a3b8', // slate-400
      borderRadius: '1.25rem',
      boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
      color: '#0f172a',
    },
    accent: {
      backgroundColor: '#f8fafc',
      border: '1.5px solid #2563eb', // blue-600
      borderRadius: '1rem',
      boxShadow: '0 2px 6px -1px rgba(37, 99, 235, 0.15)',
      color: '#0f172a',
    },
    title: {
      color: '#0f172a', // slate-900
      fontWeight: 800,
      fontSize: '1rem',
      lineHeight: '1.25',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      color: '#475569', // slate-600: strong contrast against #ffffff
      fontWeight: 500,
      fontSize: '0.8125rem',
      lineHeight: '1.4',
    },
    body: {
      color: '#1e293b', // slate-800
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
    metricNumber: {
      color: '#020617', // slate-950
      fontWeight: 900,
      fontSize: '1.875rem',
      lineHeight: '1',
      letterSpacing: '-0.03em',
    },
    metricLabel: {
      color: '#334155', // slate-700
      fontWeight: 700,
      fontSize: '0.6875rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    badgeSuccess: {
      backgroundColor: '#dcfce7', // emerald-100
      border: '1px solid #86efac', // emerald-300
      color: '#14532d', // emerald-900 (10:1 contrast ratio)
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
    badgeWarning: {
      backgroundColor: '#fef3c7', // amber-100
      border: '1px solid #fcd34d', // amber-300
      color: '#78350f', // amber-900 (9.5:1 contrast)
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
    badgeDanger: {
      backgroundColor: '#fee2e2', // rose-100
      border: '1px solid #fca5a5', // rose-300
      color: '#7f1d1d', // rose-900 (9:1 contrast)
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
    badgeNeutral: {
      backgroundColor: '#f1f5f9', // slate-100
      border: '1px solid #cbd5e1', // slate-300
      color: '#1e293b', // slate-800
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
  },
  headers: {
    pageHeader: {
      paddingBottom: '0.5rem',
      color: '#0f172a',
    },
    title: {
      color: '#0f172a',
      fontWeight: 900,
      fontSize: '1.5rem',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    subtitle: {
      color: '#334155', // slate-700
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: '1.4',
      marginTop: '0.25rem',
    },
    topBar: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #cbd5e1', // slate-300
      boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
      color: '#0f172a',
    },
    brandTitle: {
      color: '#0f172a',
      fontWeight: 800,
      letterSpacing: '0.05em',
    },
    brandSubtitle: {
      color: '#475569', // slate-600
      fontWeight: 700,
      fontSize: '0.625rem',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    sectionTitle: {
      color: '#0f172a',
      fontWeight: 800,
      fontSize: '1.125rem',
      letterSpacing: '-0.015em',
    },
  },
  navigation: {
    sidebar: {
      backgroundColor: '#ffffff',
      borderRight: '1px solid #cbd5e1', // slate-300
      boxShadow: '1px 0 3px 0 rgba(15, 23, 42, 0.04)',
      color: '#0f172a',
    },
    itemActive: {
      backgroundColor: '#1d4ed8', // blue-700
      color: '#ffffff',
      fontWeight: 700,
      boxShadow: '0 2px 4px 0 rgba(29, 78, 216, 0.25)',
      borderRadius: '0.875rem',
    },
    itemInactive: {
      backgroundColor: 'transparent',
      color: '#334155', // slate-700
      fontWeight: 600,
      borderRadius: '0.875rem',
    },
    iconActive: {
      color: '#ffffff',
    },
    iconInactive: {
      color: '#1d4ed8', // blue-700
    },
    filterSelect: {
      backgroundColor: '#ffffff',
      border: '1.5px solid #cbd5e1', // slate-300
      color: '#0f172a',
      fontWeight: 700,
      fontSize: '0.75rem',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    roleSwitcher: {
      backgroundColor: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '1rem',
      color: '#0f172a',
    },
    userCard: {
      backgroundColor: '#ffffff',
      color: '#0f172a',
    },
    activeScopeBadge: {
      color: '#1d4ed8', // blue-700
      fontWeight: 800,
      fontSize: '0.6875rem',
      textTransform: 'uppercase',
    },
  },
  tables: {
    wrapper: {
      backgroundColor: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '1rem',
      boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
      overflow: 'hidden',
    },
    thead: {
      backgroundColor: '#f1f5f9', // slate-100
      color: '#334155', // slate-700
      fontWeight: 800,
      fontSize: '0.6875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '1px solid #cbd5e1',
    },
    th: {
      padding: '0.75rem 1rem',
      color: '#334155',
    },
    trHover: {
      backgroundColor: '#f8fafc',
    },
    tdPrimary: {
      color: '#0f172a',
      fontWeight: 700,
    },
    tdSecondary: {
      color: '#475569',
      fontWeight: 500,
    },
    border: {
      borderColor: '#e2e8f0',
    },
  },
};

/**
 * Matching dark mode style object to support dynamic switching
 */
export const darkModeDashboardStyles: DashboardThemeStyles = {
  cards: {
    base: {
      backgroundColor: 'rgba(16, 35, 58, 0.65)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '1rem',
      boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.3)',
      color: '#eef3f8',
      backdropFilter: 'blur(16px)',
    },
    elevated: {
      backgroundColor: 'rgba(16, 35, 58, 0.85)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '1.25rem',
      boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.4)',
      color: '#ffffff',
    },
    accent: {
      backgroundColor: 'rgba(61, 99, 255, 0.12)',
      border: '1px solid rgba(61, 99, 255, 0.35)',
      borderRadius: '1rem',
      color: '#ffffff',
    },
    title: {
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '1rem',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      color: '#94a3b8',
      fontWeight: 500,
      fontSize: '0.8125rem',
    },
    body: {
      color: '#e2e8f0',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    metricNumber: {
      color: '#ffffff',
      fontWeight: 900,
      fontSize: '1.875rem',
      letterSpacing: '-0.03em',
    },
    metricLabel: {
      color: '#94a3b8',
      fontWeight: 700,
      fontSize: '0.6875rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    badgeSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      color: '#6ee7b7',
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
    badgeWarning: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      color: '#fcd34d',
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
    badgeDanger: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      color: '#fca5a5',
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
    badgeNeutral: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: '#e2e8f0',
      fontWeight: 700,
      fontSize: '0.6875rem',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
  },
  headers: {
    pageHeader: {
      paddingBottom: '0.5rem',
      color: '#ffffff',
    },
    title: {
      color: '#ffffff',
      fontWeight: 900,
      fontSize: '1.5rem',
      letterSpacing: '-0.025em',
    },
    subtitle: {
      color: '#94a3b8',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    topBar: {
      backgroundColor: 'rgba(7, 11, 18, 0.8)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#eef3f8',
    },
    brandTitle: {
      color: '#ffffff',
      fontWeight: 800,
    },
    brandSubtitle: {
      color: '#94a3b8',
      fontWeight: 700,
      fontSize: '0.625rem',
      textTransform: 'uppercase',
    },
    sectionTitle: {
      color: '#ffffff',
      fontWeight: 800,
      fontSize: '1.125rem',
    },
  },
  navigation: {
    sidebar: {
      backgroundColor: 'rgba(12, 22, 38, 0.9)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#eef3f8',
    },
    itemActive: {
      backgroundColor: '#3d63ff',
      color: '#ffffff',
      fontWeight: 700,
      borderRadius: '0.875rem',
    },
    itemInactive: {
      backgroundColor: 'transparent',
      color: '#cbd5e1',
      fontWeight: 600,
      borderRadius: '0.875rem',
    },
    iconActive: {
      color: '#ffffff',
    },
    iconInactive: {
      color: '#3d63ff',
    },
    filterSelect: {
      backgroundColor: '#0c1626',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '0.75rem',
      borderRadius: '0.75rem',
    },
    roleSwitcher: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      color: '#eef3f8',
    },
    userCard: {
      backgroundColor: 'transparent',
      color: '#ffffff',
    },
    activeScopeBadge: {
      color: '#60a5fa',
      fontWeight: 800,
      fontSize: '0.6875rem',
      textTransform: 'uppercase',
    },
  },
  tables: {
    wrapper: {
      backgroundColor: 'rgba(12, 22, 38, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      overflow: 'hidden',
    },
    thead: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#94a3b8',
      fontWeight: 800,
      fontSize: '0.6875rem',
      textTransform: 'uppercase',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    th: {
      padding: '0.75rem 1rem',
      color: '#94a3b8',
    },
    trHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    tdPrimary: {
      color: '#ffffff',
      fontWeight: 700,
    },
    tdSecondary: {
      color: '#cbd5e1',
      fontWeight: 500,
    },
    border: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
};

/**
 * Dynamic getter that returns the appropriate CSS-in-JS style object based on mode
 */
export function getDashboardStyles(isDarkMode: boolean): DashboardThemeStyles {
  return isDarkMode ? darkModeDashboardStyles : lightModeDashboardStyles;
}

// ============================================================================
// 2. TAILWIND CLASS CONFIGURATION PRESETS
// ============================================================================

export const lightModeTailwindConfig = {
  // Card styles
  card: 'bg-white border border-slate-300 dark:bg-[#0c1626]/80 dark:border-white/10 rounded-2xl shadow-sm text-slate-900 dark:text-white transition-all',
  cardElevated: 'bg-white border border-slate-300 dark:bg-[#0c1626] dark:border-white/15 rounded-2xl shadow-md text-slate-900 dark:text-white',
  cardHeader: 'text-slate-900 dark:text-white font-bold tracking-tight',
  cardSubtext: 'text-slate-600 dark:text-slate-400 font-medium text-xs',
  cardMetric: 'text-2xl sm:text-3xl font-black font-[\'Raleway\'] tracking-tight text-slate-950 dark:text-white',
  cardMetricLabel: 'text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400',

  // Header styles
  pageTitle: 'text-2xl font-black font-[\'Raleway\'] tracking-tight text-slate-950 dark:text-white',
  pageSubtitle: 'text-xs sm:text-sm text-slate-700 dark:text-slate-400 font-[\'Quicksand\'] font-medium',
  topBar: 'sticky top-0 z-20 px-6 sm:px-8 py-3.5 backdrop-blur-xl bg-white/95 dark:bg-[#070b12]/80 border-b border-slate-300 dark:border-white/10 shadow-xs transition-colors',

  // Navigation styles
  sidebar: 'bg-white dark:bg-[#0c1626]/90 backdrop-blur-xl border-r border-slate-300 dark:border-white/10 shadow-xs transition-all',
  navItemActive: 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-md shadow-blue-700/20 dark:shadow-blue-500/25 font-bold',
  navItemInactive: 'text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold hover:text-slate-950',
  navIconActive: 'text-white',
  navIconInactive: 'text-blue-700 dark:text-[#3d63ff]',

  // Input & Form elements
  selectInput: 'px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1626] font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]',
  textInput: 'bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-full px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700',

  // Table styling
  tableWrapper: 'overflow-hidden rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 shadow-xs',
  tableHeader: 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-400 font-bold uppercase text-xs tracking-wider border-b border-slate-300 dark:border-white/10',
  tableRowHover: 'hover:bg-slate-50 dark:hover:bg-white/5 transition-colors',
  tableCellPrimary: 'text-slate-950 dark:text-white font-bold',
  tableCellSecondary: 'text-slate-700 dark:text-slate-300 font-medium',
} as const;
