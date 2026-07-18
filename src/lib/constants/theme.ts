export const ThemeTokens = {
  colors: {
    brand: {
      primary: '#38BDF8',
      dark: '#0F172A',
    },
    background: {
      base: '#050505',
      deep: '#080A0C',
      panel: '#0D0F12',
      surface: 'rgba(255, 255, 255, 0.02)',
      surfaceElevated: 'rgba(255, 255, 255, 0.05)',
      surfaceHover: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      muted: 'rgba(255, 255, 255, 0.4)',
      slate: '#64748B',
      slateLight: '#94A3B8',
      white: '#F8FAFC',
    },
    primary: {
      default: '#3B82F6',
      transparent: 'rgba(59, 130, 246, 0.1)',
      transparentHover: 'rgba(59, 130, 246, 0.2)',
    },
    success: {
      default: '#10B981',
      transparent: 'rgba(16, 185, 129, 0.1)',
    },
    warning: {
      default: '#F59E0B',
      transparent: 'rgba(245, 158, 11, 0.1)',
    },
    danger: {
      default: '#EF4444',
      transparent: 'rgba(239, 68, 68, 0.1)',
      transparentHover: 'rgba(239, 68, 68, 0.2)',
    },

    border: {
      subtle: 'rgba(255, 255, 255, 0.05)',
      default: 'rgba(255, 255, 255, 0.1)',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Inter, sans-serif',
      mono: 'monospace',
    },
    fontSize: {
      xs: '0.625rem', // 10px
      sm: '0.75rem', // 12px
      base: '0.875rem', // 14px
      lg: '1.125rem', // 18px
      xl: '1.5rem', // 24px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
} as const;
