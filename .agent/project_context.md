# Betting PWA Project context

## Overview
A High-performance Betting Progressive Web Application (PWA) built with **Next.js 15+ (App Router)** and **Tailwind CSS**. The app features a premium dark theme, real-time sports updates, and multiple betting categories.

## Tech Stack
-   **Framework**: Next.js 15+ (App Router)
-   **Styling**: Vanilla CSS + Tailwind CSS (Avoid inline styles)
-   **State Management**: `zustand`
-   **Data Fetching**: `@tanstack/react-query`
-   **Animations**: `framer-motion`
-   **Icons**: `lucide-react`, `@mdi/font`
-   **Language Support**: `i18n` (Stored in `src/i18n`, managed by `useI18nStore`)
-   **API Integration**: Structured `v1` API (Documentation in [.agent/api_documentation.md](file:///c:/Users/ASUS/Documents/GitHub/betting-pwa/.agent/api_documentation.md))
-   **Sportsbook Flow**: Navigational structure and key components (Overview in [.agent/sportsbook_flow.md](file:///c:/Users/ASUS/Documents/GitHub/betting-pwa/.agent/sportsbook_flow.md))

## Project Structure
-   `src/app/`: Next.js App Router pages and layouts.
-   `src/components/`: Reusable UI components (Drawer, Header, Sidebar, etc.).
-   `src/constants/`: Static data and configuration.
-   `src/i18n/`: Translation files and logic.
-   `src/store/`: Zustand stores for global state (Auth, UI, i18n, etc.).
-   `src/utils/`: Utility functions and helpers.

## Key Features & Recent Work
-   **Sportsbook**: Cricket focused, consistent layout with Betslip/Open Bets.
-   **Payments**: Redesigned Deposit and Withdrawal pages with premium aesthetics.
-   **Branding Templates**: Dynamic branding templates for the platform.
-   **PWA**: Configured for mobile-first experience with `next-pwa`.
-   **Internationalization**: Multi-language support (English, Hindi, etc.).

## Guidelines
-   **Styling**: Use Tailwind CSS or CSS files; **DO NOT** use inline `style={{ ... }}` blocks.
-   **Performance**: Implement code-splitting for new pages and heavy components.
-   **Design**: Maintain a premium, dark-mode visual excellence with smooth animations and micro-interactions.
-   **SEO**: Descriptive title tags and meta descriptions for all pages.
