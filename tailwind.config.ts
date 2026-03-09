import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Fairplay247 Exact Color System ──────────────────────────────────
        // Extracted pixel-by-pixel from the screenshot

        // Brand
        primary:      'var(--primary)',   // Fairplay deep orange (CTA, active tabs, badges)
        primaryHover: 'var(--primary-hover)',   // Darker on hover
        primaryLight: 'var(--primary-light)',   // Lighter orange variant for accents

        // Backgrounds – true to the screenshot (near-pure black)
        background:   'var(--background)',   // Pure black page bg — matches screenshot
        headerBg:     'var(--header-bg)',   // Header / top nav strip
        sidebarBg:    'var(--sidebar-bg)',   // Left sidebar dark panel
        navBg:        'var(--nav-bg)',   // Bottom mobile nav
        surface:      'var(--surface)',   // Cards, panel surfaces
        surfaceLight: 'var(--surface-light)',   // Hover-state surfaces
        card:         'var(--card)',   // Card bg
        cardBorder:   'var(--card-border)',   // Subtle border
        inputBg:      'var(--header-bg)',   // Input fields

        // Text
        textPrimary:   'var(--text-primary)',  // Main body text
        textSecondary: 'var(--text-secondary)',  // Secondary / muted
        textMuted:     'var(--text-secondary)',  // Inactive / disabled

        // Odds Buttons – precisely matching Fairplay's blue/pink
        backBet:     '#72bbef',    // Back odds – Betfair-style light blue
        layBet:      '#faa9ba',    // Lay odds – soft pink
        backBetDark: '#4fa8e0',    // Pressed/selected back
        layBetDark:  '#e8899e',    // Pressed/selected lay

        // Match result colours
        success: '#4caf50',        // Green winnings / profit
        danger:  '#e53935',        // Red loss / suspended
        warn:    '#ff9800',        // Amber / pending
        live:    '#e53935',        // LIVE badge red dot

        // Accent / secondary palette
        accent:    '#ffd700',      // Gold for star/favourite highlights
        secondary: 'var(--surface)',      // Alias for surface

        // Misc
        highlight: 'var(--primary)',      // Active selection orange
        badge:     'var(--primary)',      // Count badges
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-hero':   'linear-gradient(135deg, var(--background) 0%, var(--surface) 50%, var(--background) 100%)',
        'gradient-card':   'linear-gradient(145deg, var(--surface), var(--background))',
        'gradient-orange': 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
        'gradient-gold':   'linear-gradient(135deg, #ffd700, #ff9800)',
      },

      animation: {
        'pulse-live':  'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-down':  'slideDown 0.3s ease-out',
        'fade-in':     'fadeIn 0.2s ease-out',
        'odds-flash':  'oddsFlash 0.5s ease-out',
      },

      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        oddsFlash: {
          '0%':   { backgroundColor: 'var(--primary)', transform: 'scale(1.05)' },
          '100%': { backgroundColor: 'transparent', transform: 'scale(1)' },
        },
      },

      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config
