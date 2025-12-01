import { useEffect, useState, useRef } from 'react';
import { Trophy } from 'lucide-react';

/**
 * Easter Eggs System with Achievements
 * 
 * Achievements:
 * 1. Triple-click logo → "Speed Clicker"
 * 2. Scroll to exactly 50% → "Perfectly Balanced"
 * 3. Idle 60 seconds → "Patience is a Virtue"
 * 4. Rapid 10 clicks → "Click Master"
 * 5. Copy text → "Copy Cat"
 * 6. Visit on April Fools → "Fooled Ya!"
 * 7. Konami Code → "Classic Gamer"
 * 8. Shake device → "Shake It Off"
 * 9. Visit midnight-5AM → "Night Owl"
 * 10. Visit 5AM-8AM → "Early Bird"
 * 11. Visit on weekend → "Workaholic"
 * 12. Scroll 10,000px → "Marathon Runner"
 * 13. Reach bottom <2min → "Speed Reader"
 * 14. Visit 3+ times → "Repeat Visitor"
 * 
 * Open Dev Console (tap terminal icon bottom-left or press D on desktop) to see all achievements!
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'triple-click',
    name: 'Speed Clicker',
    description: 'Triple-clicked the logo',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'perfectly-balanced',
    name: 'Perfectly Balanced',
    description: 'Scrolled to exactly 50% of the page',
    icon: '⚖️',
    unlocked: false,
  },
  {
    id: 'patience',
    name: 'Patience is a Virtue',
    description: 'Stayed idle for 60 seconds',
    icon: '💤',
    unlocked: false,
  },
  {
    id: 'rapid-clicker',
    name: 'Click Master',
    description: 'Clicked 10 times in 2 seconds',
    icon: '🖱️',
    unlocked: false,
  },
  {
    id: 'copy-cat',
    name: 'Copy Cat',
    description: 'Copied some text',
    icon: '📋',
    unlocked: false,
  },
  {
    id: 'april-fools',
    name: 'Fooled Ya!',
    description: 'Visited on April Fools\' Day',
    icon: '🤡',
    unlocked: false,
  },
  {
    id: 'konami',
    name: 'Classic Gamer',
    description: 'Entered the Konami Code',
    icon: '🎮',
    unlocked: false,
  },
  {
    id: 'shake',
    name: 'Shake It Off',
    description: 'Shook your device or moved mouse rapidly',
    icon: '📱',
    unlocked: false,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Visited between midnight and 5 AM',
    icon: '🦉',
    unlocked: false,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Visited between 5 AM and 8 AM',
    icon: '🐦',
    unlocked: false,
  },
  {
    id: 'workaholic',
    name: 'Workaholic',
    description: 'Visited on the weekend',
    icon: '💼',
    unlocked: false,
  },
  {
    id: 'marathon-runner',
    name: 'Marathon Runner',
    description: 'Scrolled a total of 10,000 pixels',
    icon: '🏃',
    unlocked: false,
  },
  {
    id: 'speed-reader',
    name: 'Speed Reader',
    description: 'Reached the bottom in under 2 minutes',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'repeat-visitor',
    name: 'Repeat Visitor',
    description: 'Visited the site 3+ times',
    icon: '🔄',
    unlocked: false,
  },
];

export function EasterEggs() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('achievements');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default achievements to ensure all achievements exist
        return ACHIEVEMENTS.map(defaultAch => {
          const savedAch = parsed.find((a: Achievement) => a.id === defaultAch.id);
          return savedAch ? { ...defaultAch, ...savedAch } : defaultAch;
        });
      }
    } catch (e) {
      console.error('Failed to load achievements:', e);
      localStorage.removeItem('achievements');
    }
    return ACHIEVEMENTS;
  });
  
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [idleCursor, setIdleCursor] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [aprilFoolsMode, setAprilFoolsMode] = useState(false);
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimesRef = useRef<number[]>([]);
  const konamiIndexRef = useRef(0);
  const userHasInteractedRef = useRef(false); // Track if user has actually interacted

  // SHOW ACHIEVEMENT LIST ON PAGE LOAD (only after dev console opened)
  useEffect(() => {
    const devConsoleOpened = localStorage.getItem('dev_console_opened') === 'true';
    
    if (devConsoleOpened) {
      // Show achievement list in console
      console.log(
        '%c🏆 ACHIEVEMENT SYSTEM',
        'color: #fbbf24; font-size: 18px; font-weight: bold; text-decoration: underline;'
      );
      console.log(
        '%c14 achievements available! Press D to open Dev Console and track your progress.',
        'color: #a855f7; font-size: 12px;'
      );
      console.log(''); // Empty line
      
      ACHIEVEMENTS.forEach((achievement, _index) => {
        const unlocked = achievements.find(a => a.id === achievement.id)?.unlocked;
        console.log(
          `%c${unlocked ? '✅' : '🔒'} ${achievement.icon} ${achievement.name}`,
          `color: ${unlocked ? '#10b981' : '#6b7280'}; font-size: 11px; ${unlocked ? 'font-weight: bold;' : ''}`
        );
        console.log(
          `   %c${achievement.description}`,
          `color: #9ca3af; font-size: 10px; font-style: italic;`
        );
      });
      
      console.log(''); // Empty line
      console.log(
        '%c💡 Hint: Explore the page to discover how to unlock each achievement!',
        'color: #6b7280; font-size: 10px; font-style: italic;'
      );
    }
  }, [achievements]);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    // Broadcast to DebugInfo component
    window.dispatchEvent(new CustomEvent('achievements-updated', { 
      detail: { achievements } 
    }));
  }, [achievements]);

  // Listen for achievements reset event
  useEffect(() => {
    const handleReset = () => {
      setAchievements(ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, unlockedAt: undefined })));
      localStorage.setItem('achievements', JSON.stringify(ACHIEVEMENTS));
    };

    window.addEventListener('achievements-reset', handleReset);
    
    return () => {
      window.removeEventListener('achievements-reset', handleReset);
    };
  }, []);

  // Unlock achievement helper
  const unlockAchievement = (id: string) => {
    // CHECK: Only unlock achievements if dev console has been opened at least once
    const devConsoleOpened = localStorage.getItem('dev_console_opened') === 'true';
    if (!devConsoleOpened) {
      return; // Silent - don't spoil the easter egg
    }
    
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      const updated = prev.map(a => 
        a.id === id 
          ? { ...a, unlocked: true, unlockedAt: Date.now() }
          : a
      );

      // Show achievement popup
      const unlockedAchievement = updated.find(a => a.id === id);
      if (unlockedAchievement) {
        setShowAchievement(unlockedAchievement);
        setTimeout(() => setShowAchievement(null), 4000);
        
        // Console message
        console.log(
          `%c🏆 Achievement Unlocked!`,
          'color: #fbbf24; font-size: 16px; font-weight: bold;'
        );
        console.log(
          `%c${unlockedAchievement.icon} ${unlockedAchievement.name}`,
          'color: #a855f7; font-size: 14px;'
        );
        console.log(
          `%c${unlockedAchievement.description}`,
          'color: #9ca3af; font-size: 12px;'
        );
      }

      return updated;
    });
  };

  // 1. TRIPLE-CLICK ON LOGO
  useEffect(() => {
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;

    const handleLogoClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked on hero heading (contains "Lukáš Machala")
      if (target.closest('h1') && target.textContent?.includes('Lukáš Machala')) {
        clickCount++;
        
        if (clickCount === 3) {
          unlockAchievement('triple-click');
          clickCount = 0;
        }
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 500); // Reset after 500ms
      }
    };

    document.addEventListener('click', handleLogoClick);
    return () => {
      document.removeEventListener('click', handleLogoClick);
      clearTimeout(clickTimer);
    };
  }, []);

  // 2. PERFECTLY BALANCED (50% scroll)
  useEffect(() => {
    let checkTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(checkTimeout);
      
      checkTimeout = setTimeout(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;
        const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        
        // Check if exactly 50% (with 1% tolerance)
        if (Math.abs(percent - 50) < 1) {
          unlockAchievement('perfectly-balanced');
          
          // Special console message with explanation
          console.log(
            '%c⚖ PERFECTLY BALANCED!',
            'color: #10b981; font-size: 16px; font-weight: bold;'
          );
          console.log(
            '%cYou scrolled to exactly 50% of the page!',
            'color: #a855f7; font-size: 12px;'
          );
          console.log(
            '%cHow did you balance it so perfectly? 🤔',
            'color: #6b7280; font-size: 11px; font-style: italic;'
          );
        }
      }, 200); // Debounce for 200ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(checkTimeout);
    };
  }, []);

  // 3. IDLE DETECTION (60 seconds) - FIXED: Only start after user interaction
  useEffect(() => {
    const markUserInteraction = () => {
      if (!userHasInteractedRef.current) {
        userHasInteractedRef.current = true;
        console.log('%c👋 User interaction detected, idle timer started', 'color: #6b7280; font-size: 10px;');
      }
    };

    const resetIdleTimer = () => {
      setIdleCursor(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      // Only start timer if user has interacted
      if (userHasInteractedRef.current) {
        idleTimerRef.current = setTimeout(() => {
          setIdleCursor(true);
          unlockAchievement('patience');
          
          // Whisper message in console
          console.log(
            '%c💤 Still here? You\'ve been idle for 60 seconds...',
            'color: #6b7280; font-size: 12px; font-style: italic;'
          );
        }, 60000); // 60 seconds
      }
    };

    const interactionEvents = ['mousedown', 'keypress', 'touchstart', 'click'];
    const idleEvents = ['mousemove', 'scroll'];

    // Mark interaction
    interactionEvents.forEach(event => window.addEventListener(event, markUserInteraction, { once: false }));
    
    // Reset timer on any activity
    [...interactionEvents, ...idleEvents].forEach(event => window.addEventListener(event, resetIdleTimer));

    return () => {
      interactionEvents.forEach(event => window.removeEventListener(event, markUserInteraction));
      [...interactionEvents, ...idleEvents].forEach(event => window.removeEventListener(event, resetIdleTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Apply idle cursor
  useEffect(() => {
    if (idleCursor) {
      document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Ctext x=\'0\' y=\'24\' font-size=\'24\'%3E💤%3C/text%3E%3C/svg%3E"), auto';
    } else {
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.cursor = '';
    };
  }, [idleCursor]);

  // 4. RAPID CLICKER (10 clicks in 2 seconds)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      clickTimesRef.current.push(now);
      
      // Remove clicks older than 2 seconds
      clickTimesRef.current = clickTimesRef.current.filter(time => now - time < 2000);
      
      if (clickTimesRef.current.length >= 10) {
        unlockAchievement('rapid-clicker');
        
        // Create particle effect at click position
        const newParticle = { id: Date.now(), x: e.clientX, y: e.clientY };
        setParticles(prev => [...prev, newParticle]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1000);
        
        clickTimesRef.current = [];
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 5. COPY TEXT
  useEffect(() => {
    const handleCopy = () => {
      unlockAchievement('copy-cat');
      
      // Add custom message to clipboard
      const selection = window.getSelection()?.toString();
      if (selection) {
        setTimeout(() => {
          console.log(
            '%c📋 Copied! Thanks for sharing lowcash.dev 🚀',
            'color: #ec4899; font-size: 12px;'
          );
        }, 100);
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  // 6. APRIL FOOLS MODE
  useEffect(() => {
    const now = new Date();
    const isAprilFools = now.getMonth() === 3 && now.getDate() === 1; // April = month 3 (0-indexed)
    
    // Check URL parameter: ?april_fools=true
    const urlParams = new URLSearchParams(window.location.search);
    const urlTrigger = urlParams.get('april_fools') === 'true';
    
    if (isAprilFools || urlTrigger) {
      unlockAchievement('april-fools');
      setAprilFoolsMode(true);
      
      console.log(
        '%c🤡 APRIL FOOLS! Everything is upside down!',
        'color: #f59e0b; font-size: 16px; font-weight: bold;'
      );
      
      // If URL trigger, show hint
      if (urlTrigger && !isAprilFools) {
        console.log(
          '%c💡 Hint: Remove ?april_fools=true from URL to disable',
          'color: #6b7280; font-size: 10px; font-style: italic;'
        );
      }
    }
  }, []);

  // Apply April Fools styling
  useEffect(() => {
    if (aprilFoolsMode) {
      document.body.style.transform = 'rotate(180deg)';
    } else {
      document.body.style.transform = '';
    }

    return () => {
      document.body.style.transform = '';
    };
  }, [aprilFoolsMode]);

  // 7. KONAMI CODE
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const expectedKey = konamiCode[konamiIndexRef.current];
      const pressedKey = e.key.toLowerCase();
      
      if (pressedKey === expectedKey.toLowerCase()) {
        konamiIndexRef.current++;
        
        if (konamiIndexRef.current === konamiCode.length) {
          unlockAchievement('konami');
          konamiIndexRef.current = 0;
          
          // Matrix rain effect (brief)
          console.log(
            '%c🎮 KONAMI CODE ACTIVATED!',
            'color: #10b981; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #10b981;'
          );
          console.log(
            '%c↑ ↑ ↓ ↓ ← → ← → B A',
            'color: #6ee7b7; font-size: 14px;'
          );
          
          // Visual feedback
          document.body.style.animation = 'konamiFlash 0.5s ease-in-out';
          setTimeout(() => {
            document.body.style.animation = '';
          }, 500);
        }
      } else {
        konamiIndexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 8. SHAKE DETECTION (mobile) + RAPID MOUSE MOVEMENT (desktop)
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let shakeCount = 0;
    let shakeTimer: NodeJS.Timeout;

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const { x = 0, y = 0, z = 0 } = acc;
      
      const safeX = x ?? 0;
      const safeY = y ?? 0;
      const safeZ = z ?? 0;
      
      const deltaX = Math.abs(safeX - lastX);
      const deltaY = Math.abs(safeY - lastY);
      const deltaZ = Math.abs(safeZ - lastZ);
      
      const totalDelta = deltaX + deltaY + deltaZ;
      
      if (totalDelta > 30) {
        shakeCount++;
        
        clearTimeout(shakeTimer);
        shakeTimer = setTimeout(() => {
          shakeCount = 0;
        }, 1000);
        
        if (shakeCount >= 3) {
          unlockAchievement('shake');
          shakeCount = 0;
          
          // Shuffle colors (trigger re-render of orb colors)
          const root = document.documentElement;
          const randomVariation = Math.random() * 100;
          root.style.setProperty('--color-variation', String(randomVariation / 100));
          
          console.log(
            '%c📱 Device shake detected! Colors shuffled!',
            'color: #ec4899; font-size: 14px;'
          );
        }
      }
      
      lastX = safeX;
      lastY = safeY;
      lastZ = safeZ;
    };

    // DESKTOP ALTERNATIVE: Rapid mouse movement
    let mouseMovements: Array<{ time: number; distance: number }> = [];
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Calculate distance from last position
      const deltaX = Math.abs(e.clientX - lastX);
      const deltaY = Math.abs(e.clientY - lastY);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Track significant movements (increased threshold from 50 to 100)
      if (distance > 100) {
        mouseMovements.push({ time: now, distance });
        
        // Remove old movements (older than 1 second)
        mouseMovements = mouseMovements.filter(m => now - m.time < 1000);
        
        // Check if we have rapid movement (increased from 5 to 8 movements, increased total distance from 1000 to 2000px)
        if (mouseMovements.length >= 8) {
          const totalDistance = mouseMovements.reduce((sum, m) => sum + m.distance, 0);
          
          // If total distance > 2000px in 1 second (doubled from 1000)
          if (totalDistance > 2000) {
            unlockAchievement('shake');
            mouseMovements = [];
            
            // Shuffle colors
            const root = document.documentElement;
            const randomVariation = Math.random() * 100;
            root.style.setProperty('--color-variation', String(randomVariation / 100));
            
            console.log(
              '%c🖱️ Rapid mouse movement detected! Colors shuffled!',
              'color: #ec4899; font-size: 14px;'
            );
          }
        }
      }
      
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(shakeTimer);
    };
  }, []);

  // 9. NIGHT OWL (midnight to 5 AM)
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 0 && hours < 5) {
      unlockAchievement('night-owl');
      
      console.log(
        '%c🦉 NIGHT OWL! You visited between midnight and 5 AM!',
        'color: #6b7280; font-size: 16px; font-weight: bold;'
      );
    }
  }, []);

  // 10. EARLY BIRD (5 AM to 8 AM)
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 5 && hours < 8) {
      unlockAchievement('early-bird');
      
      console.log(
        '%c🐦 EARLY BIRD! You visited between 5 AM and 8 AM!',
        'color: #6b7280; font-size: 16px; font-weight: bold;'
      );
    }
  }, []);

  // 11. WORKAHOLIC (weekend)
  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    if (dayOfWeek === 6 || dayOfWeek === 0) { // Saturday (6) or Sunday (0)
      unlockAchievement('workaholic');
      
      console.log(
        '%c💼 WORKAHOLIC! You visited on the weekend!',
        'color: #6b7280; font-size: 16px; font-weight: bold;'
      );
    }
  }, []);

  // 12. MARATHON RUNNER (10,000 pixels scrolled)
  useEffect(() => {
    let totalScroll = 0;
    
    const handleScroll = () => {
      totalScroll += Math.abs(window.scrollY - (document.documentElement.scrollTop || document.body.scrollTop));
      
      if (totalScroll >= 10000) {
        unlockAchievement('marathon-runner');
        
        console.log(
          '%c🏃 MARATHON RUNNER! You scrolled a total of 10,000 pixels!',
          'color: #6b7280; font-size: 16px; font-weight: bold;'
        );
        
        // Remove event listener to prevent further unlocking
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 13. SPEED READER (reach bottom in under 2 minutes)
  useEffect(() => {
    const startTime = Date.now();
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      
      if (scrollTop >= maxScroll) {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // Convert to seconds
        
        if (duration < 120) { // 2 minutes
          unlockAchievement('speed-reader');
          
          console.log(
            '%c📚 SPEED READER! You reached the bottom in under 2 minutes!',
            'color: #6b7280; font-size: 16px; font-weight: bold;'
          );
          
          // Remove event listener to prevent further unlocking
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 14. REPEAT VISITOR (3+ visits)
  useEffect(() => {
    const visitCount = localStorage.getItem('visit_count');
    const count = visitCount ? parseInt(visitCount, 10) : 0;
    
    if (count >= 3) {
      unlockAchievement('repeat-visitor');
      
      console.log(
        '%c🔄 REPEAT VISITOR! You visited the site 3+ times!',
        'color: #6b7280; font-size: 16px; font-weight: bold;'
      );
    }
    
    // Increment visit count
    localStorage.setItem('visit_count', String(count + 1));
  }, []);

  return (
    <>
      {/* Achievement Popup */}
      {/* Achievement Popup - slide in from right with particles */}
      {showAchievement && (
        <div
          className="fixed top-4 right-4 z-[100] border border-purple-500/50 rounded-xl p-4 shadow-2xl max-w-xs backdrop-blur-md"
          style={{
            right: '2rem',
            top: '2rem',
            animation: 'slideInRight 0.5s ease-out forwards',
            boxShadow: '0 0 50px rgba(139, 92, 246, 0.4), 0 0 100px rgba(139, 92, 246, 0.2)',
            backdropFilter: 'blur(5px)',
            background: 'rgba(0, 0, 0, 0.75)',
          }}
        >
          <div className="flex items-start gap-3">
              <div className="text-3xl">{showAchievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">Achievement Unlocked!</span>
                </div>
                <h3 className="text-white font-semibold">{showAchievement.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{showAchievement.description}</p>
              </div>
            </div>
        </div>
      )}

      {/* Particle Effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-[90]"
          style={{
            left: particle.x,
            top: particle.y,
            animation: 'particleExplosion 1s ease-out forwards'
          }}
        >
          <div className="relative">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-purple-500 rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-30px)`,
                  opacity: 0,
                  animation: `particleFade 1s ease-out ${i * 0.05}s forwards`
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes particleExplosion {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes particleFade {
          0% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateY(0);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--rotation)) translateY(-60px);
          }
        }

        @keyframes konamiFlash {
          0%, 100% {
            filter: none;
          }
          50% {
            filter: hue-rotate(180deg) brightness(1.2);
          }
        }
      `}</style>
    </>
  );
}