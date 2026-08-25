/**
 * Centralized section configuration
 * Single source of truth for gradients, colors, and styling
 */

export const SECTION_STYLES = {
  hero: {
    gradient: 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400',
    glowColors: {
      primary: 'rgba(168, 85, 247, 0.6)',
      secondary: 'rgba(244, 114, 182, 0.4)',
    },
    orbColor: { r: 236, g: 72, b: 153 },
  },
  featuredProjects: {
    gradient: 'bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500',
    glowColors: {
      primary: 'rgba(168, 85, 247, 0.45)',
      secondary: 'rgba(99, 102, 241, 0.25)',
    },
    orbColor: { r: 99, g: 102, b: 241 },
  },
  backgroundExperience: {
    gradient: 'bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-400',
    glowColors: {
      primary: 'rgba(34, 211, 238, 0.45)',
      secondary: 'rgba(20, 184, 166, 0.25)',
    },
    orbColor: { r: 20, g: 184, b: 166 },
  },
  contact: {
    gradient: 'bg-gradient-to-r from-fuchsia-400 via-pink-500 to-purple-400',
    glowColors: {
      primary: 'rgba(232, 121, 249, 0.45)',
      secondary: 'rgba(244, 114, 182, 0.25)',
    },
    orbColor: { r: 232, g: 121, b: 249 },
  },
} as const

/** Orb colors in page section order */
export const ORB_COLORS = [
  SECTION_STYLES.hero.orbColor,
  SECTION_STYLES.featuredProjects.orbColor,
  SECTION_STYLES.backgroundExperience.orbColor,
  SECTION_STYLES.contact.orbColor,
] as const
