# Project Architecture

## Overview
This project is a single-page React application built with Vite, designed as a high-performance developer portfolio. It features a custom scroll-based navigation system, parallax effects, and an interactive achievement system.

## Directory Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # React components
│   ├── shared/      # Reusable UI components
│   ├── ui/          # Base UI elements (buttons, inputs)
│   └── [Feature].tsx # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities, constants, and helpers
├── styles/          # Global styles and Tailwind configuration
├── App.tsx          # Main application component and layout
└── main.tsx         # Entry point
```

## Key Systems

### 1. Scroll Navigation
- **Implementation**: `ScrollNavigation.tsx` + `App.tsx`
- **Logic**: Uses `IntersectionObserver` (or manual scroll tracking) to detect active sections.
- **State**: `currentSection` index tracks the visible section.
- **Mobile**: Custom drawer with touch gesture support.

### 2. Achievement System ("Easter Eggs")
- **Implementation**: `EasterEggs.tsx`
- **Storage**: `localStorage` persists unlocked achievements.
- **Triggers**: Konami code, specific scroll patterns, console interactions.
- **UI**: Custom toast notifications with backdrop blur.

### 3. Animations
- **Library**: Framer Motion
- **Patterns**:
  - `ParallaxSection`: Wraps content with scroll-linked motion values.
  - `AnimatedBackground`: Canvas/WebGL or CSS-based background effects.
  - `Reveal`: Components fade in when entering viewport.

## Tech Stack Decisions
- **Vite**: Chosen for fast HMR and efficient production builds.
- **Tailwind CSS**: Utility-first styling for rapid development and consistent design system.
- **TypeScript**: Strict type safety to prevent runtime errors.
