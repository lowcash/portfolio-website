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
    // Background orb color (purple-pink-orange blend - vibrant!)
    orbColor: { r: 236, g: 72, b: 153 }, // pink-400 - střed gradientu
  },
  whoIAm: {
    gradient: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400',
    glowColors: {
      primary: 'rgba(34, 211, 238, 0.6)',
      secondary: 'rgba(59, 130, 246, 0.4)',
    },
    orbColor: { r: 59, g: 130, b: 246 },
  },
  techJourney: {
    gradient: 'bg-gradient-to-r from-orange-400 via-amber-500 to-red-400',
    glowColors: {
      primary: 'rgba(251, 146, 60, 0.6)',
      secondary: 'rgba(245, 158, 11, 0.4)',
    },
    orbColor: { r: 251, g: 146, b: 60 },
  },
  notableWork: {
    gradient: 'bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500',
    glowColors: {
      primary: 'rgba(168, 85, 247, 0.6)',
      secondary: 'rgba(99, 102, 241, 0.4)',
    },
    orbColor: { r: 99, g: 102, b: 241 },
  },
  education: {
    gradient: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400',
    glowColors: {
      primary: 'rgba(34, 197, 94, 0.6)',
      secondary: 'rgba(16, 185, 129, 0.4)',
    },
    orbColor: { r: 34, g: 197, b: 94 },
  },
  workExperience: {
    gradient: 'bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-400',
    glowColors: {
      primary: 'rgba(34, 211, 238, 0.6)',
      secondary: 'rgba(20, 184, 166, 0.4)',
    },
    orbColor: { r: 20, g: 184, b: 166 },
  },
  beyondCode: {
    gradient: 'bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400',
    glowColors: {
      primary: 'rgba(163, 230, 53, 0.6)',
      secondary: 'rgba(34, 197, 94, 0.4)',
    },
    orbColor: { r: 163, g: 230, b: 53 },
  },
  whatsNext: {
    gradient: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400',
    glowColors: {
      primary: 'rgba(250, 204, 21, 0.6)',
      secondary: 'rgba(251, 191, 36, 0.4)',
    },
    orbColor: { r: 250, g: 204, b: 21 },
  },
  contact: {
    gradient: 'bg-gradient-to-r from-fuchsia-400 via-pink-500 to-purple-400',
    glowColors: {
      primary: 'rgba(232, 121, 249, 0.6)',
      secondary: 'rgba(244, 114, 182, 0.4)',
    },
    orbColor: { r: 232, g: 121, b: 249 },
  },
} as const

/**
 * Extract orb colors for AnimatedBackground
 * Single source of truth - no duplication!
 */
export const ORB_COLORS = [
  SECTION_STYLES.hero.orbColor,
  SECTION_STYLES.whoIAm.orbColor,
  SECTION_STYLES.techJourney.orbColor,
  SECTION_STYLES.notableWork.orbColor,
  SECTION_STYLES.education.orbColor,
  SECTION_STYLES.workExperience.orbColor,
  SECTION_STYLES.beyondCode.orbColor,
  SECTION_STYLES.whatsNext.orbColor,
  SECTION_STYLES.contact.orbColor,
] as const
