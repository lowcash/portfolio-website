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

The project uses Tailwind CSS for utility-first styling.

Policy:

- `src/styles/globals.css` is the authored global style source.
- `src/index.css` is generated output consumed by `app/layout.tsx`.
- Edit authored styles, then regenerate output via the project workflow.

---

**Author**: Lowcash
**License**: MIT
