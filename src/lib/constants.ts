/**
 * Application-wide constants
 * Centralized configuration for animations, thresholds, and timing
 */

export const SECTION_COUNT = 4 // Total number of sections in the app

export const ANIMATION_CONFIG = {
  // Scroll reveal animation
  SCROLL_REVEAL_THRESHOLD: 0.15, // 15% visibility triggers fade-in
  SCROLL_REVEAL_ROOT_MARGIN: '0px',

  // Smooth scrolling easing
  SMOOTH_SCROLL_EASING: 0.1,
  SMOOTH_SCROLL_SNAP_THRESHOLD: 0.01,

  // Stagger animations
  STAGGER_DELAY_MS: 100,
  STAGGER_BASE_DELAY_MS: 200,

  // Background orbs – kept subtle so body copy stays readable
  ORB_OPACITY_MIN: 0.08,
  ORB_OPACITY_MAX: 0.12,
} as const
