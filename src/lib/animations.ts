// Animation debug toggle - set to false to disable all animations
export const ANIMATIONS_ENABLED = false;

// Default animation variants
export const fadeIn = ANIMATIONS_ENABLED 
  ? {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, amount: 0.1 },
      transition: { duration: 0.4, ease: "easeOut" }
    }
  : {
      initial: {},
      whileInView: {},
      viewport: { once: true, amount: 0.1 },
      transition: { duration: 0 }
    };

export const fadeInSlow = ANIMATIONS_ENABLED
  ? {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, amount: 0.1 },
      transition: { duration: 0.6, ease: "easeOut" }
    }
  : {
      initial: {},
      whileInView: {},
      viewport: { once: true, amount: 0.1 },
      transition: { duration: 0 }
    };

// For hero section (uses animate instead of whileInView)
export const heroFadeIn = ANIMATIONS_ENABLED
  ? {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.2 }
    }
  : {
      initial: {},
      animate: {},
      transition: { duration: 0 }
    };
