---
applyTo: 'src/components/**/*.{ts,tsx},src/lib/**/*.{ts,tsx},src/styles/**/*.css'
---

# Architecture & Component Organization (Framework-Agnostic)

This document outlines architectural principles applicable across frameworks (Next.js, Vite, Svelte, etc.).  
For framework-specific implementation details, see `next-app-router.instructions.md`.

## Core Principles

### 1. **Component Layering**

Organize components into logical layers to prevent mixing concerns:

| Layer | Unit | Purpose | Constraints |
|-------|------|---------|-------------|
| **UI Layer** | `components/ui/` | Base styled components (buttons, cards, containers) | Zero business logic; pure presentation |
| **Feature Layer** | `components/features/` | Content modules (sections, pages) | Compose UI primitives; no raw className styling |
| **Shared Layer** | `components/shared/` | Utilities used across features (animations, effects) | May be stateful; prevent duplication |
| **Layout Layer** | `components/layout/` | Structure wrappers (container, wrapper) | Pure composition; no raw styling |

**Rule**: Features compose UI primitives. Never define raw styling in features.

### 2. **State Boundaries**

Clear separation of state ownership:

| State Type | Owner | Example |
|----------|-------|---------|
| **Server state** | Data fetching layer | Page content, metadata |
| **Engine state** | Client root component | Current section, menu open/closed |
| **Local state** | Feature component | Form input, dropdown toggled |
| **Persistent state** | Browser storage | User preferences, achievements |

**Best Practice**: Centralize "engine" state in a single orchestrator component.

### 3. **Styling Strategy**

- **Global Styles**: One entry point (CSS/SCSS/Tailwind); animations, resets, CSS variables
- **Component Styles**: Utility-first (Tailwind), never raw class definitions
- **Dynamic Values**: CSS custom properties for runtime changes (no React re-renders)
- **Responsive**: Mobile-first media query approach

## See Also

- `next-app-router.instructions.md` – Next.js 15+ specific implementation
- `docs/ARCHITECTURE.md` – Full system design for this project
- `clean-code.instructions.md` – Code quality guidelines
- `imports.instructions.md` – Import organization
