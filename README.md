# Personal Presentation Website

A modern, interactive developer portfolio featuring scroll-based navigation, parallax effects, and a hidden achievement system.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Next.js (App Router)** - SSR-first framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
  components/       # UI Components
    shared/         # Reusable components
    ui/             # Base UI elements
  hooks/            # Custom React hooks
  lib/              # Utilities & constants
  styles/           # Global styles
  assets/           # Static assets
```

## 🛠️ Development

### Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## 📝 Key Features

- **Scroll Navigation**: Smooth section-based scrolling with active state detection
- **Interactive UI**: Parallax effects, animated backgrounds, and reveal animations
- **Achievement System**: Hidden "Easter eggs" unlockable via developer console and interactions
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Performance**: Lazy loading, optimized assets, and efficient rendering

## 🌐 Deployment

Deployed on Vercel with automatic deployments from the main branch.
Live URL: [https://lowcash.dev](https://lowcash.dev)

## 🎨 Styling

The project uses **Tailwind CSS v4+** for utility-first styling with a modular CSS architecture.

### CSS Structure

```
src/styles/
├── globals.css       # Entry point (@imports all modules)
├── theme.css         # Design tokens & CSS variables (colors, spacing tokens)
├── typography.css    # Font scale, heading styles, text element defaults
├── base.css          # HTML/body reset, scroll behavior, a11y helpers
├── accessibility.css # Focus styles, skip-to-content, screen-reader utilities
└── animations.css    # Keyframes (glow, floating, orbs) & animation utilities
```

### Development Workflow

- **Edit** authored styles in `src/styles/` modules
- **Import** `src/styles/globals.css` in `src/app/layout.tsx` (orchestrates all submodules)
- **Tailwind** automatically compiles utilities from component `className` attributes
- **Dev Server**: CSS output hot-reloads without page refresh

### CSS Variables (Dynamic Theming)

Components use CSS custom properties for runtime customization:

```css
/* Set by JavaScript based on current section */
--orb-r: 255; /* Red component (0-255) */
--orb-g: 100; /* Green component (0-255) */
--orb-b: 50; /* Blue component (0-255) */

/* Consumed by animations & components */
color: rgb(var(--orb-r), var(--orb-g), var(--orb-b));
box-shadow: 0 0 20px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.5);
```

**Benefits**: No React re-renders for color updates; GPU-accelerated CSS changes only.

---

**Author**: Lowcash
**License**: MIT
