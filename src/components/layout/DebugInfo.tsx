import { useEffect, useState, useRef } from 'react';
import { Terminal, Trophy } from 'lucide-react';
import type { Achievement } from '../features/EasterEggs';

/**
 * Debug component - Easter egg for developers
 * Toggle with "D" key
 * Only available in development mode or when manually enabled
 */

// Achievement hints (how to unlock)
const ACHIEVEMENT_HINTS: Record<string, string> = {
  'triple-click': 'Triple-click the hero heading',
  'perfectly-balanced': 'Scroll to exactly 50% of the page',
  'patience': 'Stay idle for 60 seconds',
  'rapid-clicker': 'Click 10 times in 2 seconds',
  'copy-cat': 'Copy some text from the page',
  'april-fools': 'Visit on April 1st', // Don't mention URL param
  'konami': 'Enter the Konami Code',
  'shake': 'Shake your device or move mouse rapidly',
  'night-owl': 'Visit between midnight and 5 AM',
  'early-bird': 'Visit between 5 AM and 8 AM',
  'workaholic': 'Visit on the weekend',
  'marathon-runner': 'Scroll a total of 10,000 pixels',
  'speed-reader': 'Reach the bottom in under 2 minutes',
  'repeat-visitor': 'Visit the site 3+ times',
};

interface DebugInfoProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

export function DebugInfo({ onVisibilityChange }: DebugInfoProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [orbR, setOrbR] = useState(0);
  const [orbG, setOrbG] = useState(0);
  const [orbB, setOrbB] = useState(0);
  const [fps, setFps] = useState(60);
  
  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Tooltip state
  const [tooltip, setTooltip] = useState<{ achievement: Achievement; show: boolean } | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const achievementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Panel ref for click outside detection
  const panelRef = useRef<HTMLDivElement>(null);

  // Persistent position - TOP LEFT with padding (desktop default)
  const [position, setPosition] = useState(() => {
    if (typeof window === 'undefined') return { x: 20, y: 20 }; // Top-left with 20px padding
    const saved = localStorage.getItem('debug_position');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate position is within viewport (not off-screen)
      const isValidX = parsed.x >= -200 && parsed.x < window.innerWidth;
      const isValidY = parsed.y >= -200 && parsed.y < window.innerHeight;
      if (isValidX && isValidY) {
        return parsed;
      }
    }
    // Default or invalid position
    return { x: 20, y: 20 };
  });

  // Persistent scale - DEFAULT 125% (1.0 = 125%, 0.8 = 100%)
  const [scale, setScale] = useState(() => {
    if (typeof window === 'undefined') return 1.0; // 125% default
    const saved = localStorage.getItem('debug_scale');
    return saved ? parseFloat(saved) : 1.0;
  });
  
  // Easter egg settings
  const [orbBrightness, setOrbBrightness] = useState(() => {
    return parseFloat(localStorage.getItem('orb_brightness') || '0.5');
  });
  const [animationSpeed, setAnimationSpeed] = useState(() => {
    return parseFloat(localStorage.getItem('animation_speed') || '3.0');
  });
  const [colorVariation, setColorVariation] = useState(() => {
    return parseFloat(localStorage.getItem('color_variation') || '40');
  });
  const [orbSize, setOrbSize] = useState(() => {
    return parseFloat(localStorage.getItem('orb_size') || '1.2');
  });
  const [orbBlur, setOrbBlur] = useState(() => {
    return parseFloat(localStorage.getItem('orb_blur') || '1.0');
  });
  const [orbOpacity, setOrbOpacity] = useState(() => {
    return parseFloat(localStorage.getItem('orb_opacity') || '2.0'); // 200% default
  });
  const [positionVariation, setPositionVariation] = useState(() => {
    return parseFloat(localStorage.getItem('position_variation') || '1.0');
  });
  
  // Apply settings to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--orb-brightness', String(orbBrightness));
    root.style.setProperty('--animation-speed', String(animationSpeed));
    root.style.setProperty('--color-variation', String(colorVariation / 100)); // normalize to 0-1
    root.style.setProperty('--orb-size', String(orbSize));
    root.style.setProperty('--orb-blur', String(orbBlur));
    root.style.setProperty('--orb-opacity', String(orbOpacity));
    root.style.setProperty('--position-variation', String(positionVariation));
    localStorage.setItem('orb_brightness', String(orbBrightness));
    localStorage.setItem('animation_speed', String(animationSpeed));
    localStorage.setItem('color_variation', String(colorVariation));
    localStorage.setItem('orb_size', String(orbSize));
    localStorage.setItem('orb_blur', String(orbBlur));
    localStorage.setItem('orb_opacity', String(orbOpacity));
    localStorage.setItem('position_variation', String(positionVariation));
  }, [orbBrightness, animationSpeed, colorVariation, orbSize, orbBlur, orbOpacity, positionVariation]);

  // Toggle visibility with "D" key
  useEffect(() => {
    // Show console hint on first load
    const hasSeenHint = sessionStorage.getItem('debug_hint_shown');
    if (!hasSeenHint) {
      console.log(
        '%c🎮 Easter Egg Found!',
        'color: #ec4899; font-size: 16px; font-weight: bold;'
      );
      console.log(
        '%cPress "D" to toggle Developer Console',
        'color: #a855f7; font-size: 12px;'
      );
      console.log(
        '%c→ Live scroll tracking\n→ RGB color values\n→ FPS monitoring\n→ Orb brightness control\n→ Vignette style switcher',
        'color: #8b5cf6; font-size: 11px;'
      );
      sessionStorage.setItem('debug_hint_shown', 'true');
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setIsVisible(prev => {
          const newVal = !prev;
          // Mark dev console as opened (enables achievement system)
          if (newVal) {
            localStorage.setItem('dev_console_opened', 'true');
            console.log(
              '%c🎮 Achievement system activated!',
              'color: #10b981; font-size: 12px; font-weight: bold;'
            );
          }
          return newVal;
        });
      }
    };

    // Mobile: 4-finger tap to toggle
    let touchCount = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 4) {
        touchCount++;
        if (touchCount === 1) {
          setIsVisible(prev => !prev);
          // Reset after 500ms
          setTimeout(() => { touchCount = 0; }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Track scroll and orb colors
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      
      const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollPercent(percent);

      // Get computed orb colors from CSS variables
      const root = getComputedStyle(document.documentElement);
      setOrbR(parseInt(root.getPropertyValue('--orb-r')) || 0);
      setOrbG(parseInt(root.getPropertyValue('--orb-g')) || 0);
      setOrbB(parseInt(root.getPropertyValue('--orb-b')) || 0);

      // Calculate FPS
      frameCount++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const fpsInterval = setInterval(() => {
      handleScroll(); // Update FPS regularly
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(fpsInterval);
    };
  }, []);

  // Listen for achievement updates
  useEffect(() => {
    const handleAchievementsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      setAchievements(customEvent.detail.achievements);
    };

    window.addEventListener('achievements-updated', handleAchievementsUpdate);
    
    // Load initial achievements
    const saved = localStorage.getItem('achievements');
    if (saved) {
      setAchievements(JSON.parse(saved));
    }

    return () => {
      window.removeEventListener('achievements-updated', handleAchievementsUpdate);
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!isVisible) return;

    // REMOVED - no longer close on click outside
    // User must click the X button to close
  }, [isVisible]);

  // Drag & drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'BUTTON' && 
        (e.target as HTMLElement).tagName !== 'INPUT') {
      
      // Get button positions to avoid drag conflicts
      const isMobile = window.innerWidth < 768;
      const hamburgerRect = { top: 24, right: 24, width: 56, height: 56 }; // top-6 right-6 + button size
      const scrollToTopRect = { bottom: 32, right: 32, width: 56, height: 56 }; // bottom-8 right-8 + button size
      
      // Check if click is in "forbidden zones"
      const clickX = e.clientX;
      const clickY = e.clientY;
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      
      // Hamburger zone (top-right on mobile, but we still check on desktop for consistency)
      const inHamburgerZone = isMobile && (
        clickX > winWidth - hamburgerRect.right - hamburgerRect.width &&
        clickX < winWidth - hamburgerRect.right + hamburgerRect.width &&
        clickY > hamburgerRect.top - hamburgerRect.height &&
        clickY < hamburgerRect.top + hamburgerRect.height
      );
      
      // Scroll-to-top zone (bottom-right)
      const inScrollToTopZone = (
        clickX > winWidth - scrollToTopRect.right - scrollToTopRect.width &&
        clickX < winWidth - scrollToTopRect.right + scrollToTopRect.width &&
        clickY > winHeight - scrollToTopRect.bottom - scrollToTopRect.height &&
        clickY < winHeight - scrollToTopRect.bottom + scrollToTopRect.height
      );
      
      // Don't start drag if in forbidden zones
      if (inHamburgerZone || inScrollToTopZone) {
        return;
      }
      
      setIsDragging(true);
      setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth 60fps dragging
      requestAnimationFrame(() => {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Update position immediately with no threshold
        setPosition({ x: newX, y: newY });
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Restore text selection
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragOffset]);

  // Save position on drag end
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('debug_position', JSON.stringify(position));
    }
  }, [isDragging, position]);

  // Save scale on resize end
  useEffect(() => {
    localStorage.setItem('debug_scale', String(scale));
  }, [scale]);

  // Notify parent about visibility change
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  // Mobile: Auto-close tooltip on scroll
  useEffect(() => {
    const checkMobile = window.innerWidth < 768;
    if (!checkMobile || !tooltip) return;

    const handleScroll = () => {
      // Clear tooltip timeout and hide tooltip
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      setTooltip(null);
    };

    // Listen to scroll on the console content div (mobile fullscreen modal)
    const consoleContent = document.querySelector('.overflow-y-auto.overscroll-contain');
    if (consoleContent) {
      consoleContent.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        consoleContent.removeEventListener('scroll', handleScroll);
      };
    }
  }, [tooltip]);

  // Check if mobile (before render)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isVisible) {
    return (
      <div 
        className="fixed z-[100] bottom-4 left-4 opacity-20 hover:opacity-100 transition-opacity cursor-pointer touch-none"
        onClick={() => {
          setIsVisible(true);
          // Mark dev console as opened (enables achievement system)
          localStorage.setItem('dev_console_opened', 'true');
          console.log(
            '%c🎮 Achievement system activated!',
            'color: #10b981; font-size: 12px; font-weight: bold;'
          );
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          setIsVisible(true);
          localStorage.setItem('dev_console_opened', 'true');
          console.log(
            '%c🎮 Achievement system activated!',
            'color: #10b981; font-size: 12px; font-weight: bold;'
          );
        }}
        title="Tap to open dev console (or press 'D' on desktop)"
        aria-label="Toggle debug console"
        style={{
          // iOS safe area
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        }}
      >
        {/* Just the icon, no background - more subtle */}
        <Terminal className="w-6 h-6 text-gray-400" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Fullscreen modal with backdrop */}
      {isMobile && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="h-full w-full flex flex-col">
            {/* Cyber/retro styled panel - MOBILE fullscreen with scroll */}
            <div 
              className="relative h-full flex flex-col backdrop-blur-xl"
              role="region"
              aria-label="Developer debug console"
              style={{
                background: 'rgba(3, 7, 18, 0.95)'
              }}
            >
              {/* Header - Fixed at top */}
              <div 
                className="px-4 py-3 flex items-center justify-between border-b-2 flex-shrink-0"
                style={{ 
                  borderColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
                  background: `rgba(${orbR}, ${orbG}, ${orbB}, 0.15)`
                }}
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" style={{ color: `rgb(${orbR}, ${orbG}, ${orbB})` }} />
                  <span className="text-white">DEV.CONSOLE</span>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-2xl w-8 h-8 flex items-center justify-center"
                  aria-label="Close console"
                >
                  ✕
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                {/* Rest of content from desktop version */}
                {renderConsoleContent()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Draggable panel */}
      {!isMobile && (
        <div 
          ref={panelRef}
          className={`fixed z-[70] font-mono text-xs transition-all ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          role="region"
          aria-label="Developer debug console"
          style={{ 
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `scale(${scale})`
          }}
        >
          {/* Cyber/retro styled panel */}
          <div 
            className="relative border-2 rounded-lg overflow-visible backdrop-blur-xl"
            style={{
              borderColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              boxShadow: `0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.3), inset 0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.05)`,
              background: 'rgba(3, 7, 18, 0.9)'
            }}
          >
            {/* Header */}
            <div 
              className="px-4 py-2 flex items-center justify-between border-b-2"
              style={{ 
                borderColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
                background: `rgba(${orbR}, ${orbG}, ${orbB}, 0.1)`
              }}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" style={{ color: `rgb(${orbR}, ${orbG}, ${orbB})` }} />
                <span className="text-white">DEV.CONSOLE</span>
                <span className="text-[8px] text-gray-500">(drag to move)</span>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2 min-w-[280px]">
              {renderConsoleContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Helper function to render console content (shared between mobile and desktop)
  function renderConsoleContent() {
    return (
      <>
        {/* Scroll Progress */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">SCROLL:</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${scrollPercent}%`,
                  background: `linear-gradient(90deg, rgb(${orbR}, ${orbG}, ${orbB}), rgba(${orbR}, ${orbG}, ${orbB}, 0.6))`
                }}
              />
            </div>
            <span className="text-white tabular-nums w-12 text-right">{scrollPercent.toFixed(1)}%</span>
          </div>
        </div>

        {/* RGB Values */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">ORB_RGB:</span>
          <div className="flex gap-2 text-white tabular-nums">
            <span style={{ color: `rgb(255, ${orbG}, ${orbB})` }}>{orbR.toString().padStart(3, '0')}</span>
            <span style={{ color: `rgb(${orbR}, 255, ${orbB})` }}>{orbG.toString().padStart(3, '0')}</span>
            <span style={{ color: `rgb(${orbR}, ${orbG}, 255)` }}>{orbB.toString().padStart(3, '0')}</span>
          </div>
        </div>

        {/* Color Preview */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">COLOR:</span>
          <div 
            className="w-32 h-6 rounded border-2 border-gray-700"
            style={{ 
              background: `rgb(${orbR}, ${orbG}, ${orbB})`,
              boxShadow: `0 0 10px rgba(${orbR}, ${orbG}, ${orbB}, 0.5)`
            }}
          />
        </div>

        {/* FPS */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">FPS:</span>
          <span 
            className="text-white tabular-nums"
            style={{ color: fps < 30 ? '#ef4444' : fps < 50 ? '#f59e0b' : '#10b981' }}
          >
            {fps}
          </span>
        </div>
        
        {/* DIVIDER */}
        <div className="border-t-2 border-gray-800 my-3" style={{ borderColor: `rgba(${orbR}, ${orbG}, ${orbB}, 0.3)` }} />
        
        {/* CONTROLS SECTION */}
        <div className="space-y-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider">⚙️ Controls</div>
          
          {/* Animation Speed Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[10px]">ANIMATION SPEED:</span>
              <span className="text-white tabular-nums text-[10px]">{animationSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`
              }}
            />
          </div>
          
          {/* Color Variation Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[10px]">COLOR VARIATION:</span>
              <span className="text-white tabular-nums text-[10px]">{colorVariation.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={colorVariation}
              onChange={(e) => setColorVariation(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`
              }}
            />
          </div>
          
          {/* Position Variation Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[10px]">POSITION SPREAD:</span>
              <span className="text-white tabular-nums text-[10px]">{(positionVariation * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              value={positionVariation}
              onChange={(e) => setPositionVariation(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`
              }}
            />
          </div>
          
          {/* Orb Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[10px]">ORB SIZE:</span>
              <span className="text-white tabular-nums text-[10px]">{orbSize.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={orbSize}
              onChange={(e) => setOrbSize(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`
              }}
            />
          </div>
          
          {/* Orb Blur Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[10px]">ORB BLUR:</span>
              <span className="text-white tabular-nums text-[10px]">{orbBlur.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={orbBlur}
              onChange={(e) => setOrbBlur(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`
              }}
            />
          </div>
          
          {/* Orb Opacity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[10px]">ORB OPACITY:</span>
              <span className="text-white tabular-nums text-[10px]">{(orbOpacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              value={orbOpacity}
              onChange={(e) => setOrbOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`
              }}
            />
          </div>
          
          {/* Scale Slider - RESIZABLE CONSOLE */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[10px]">CONSOLE SCALE:</span>
              <span className="text-white tabular-nums text-[10px]">{((scale / 0.8) * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.2"
              step="0.05"
              value={scale}
              onChange={(e) => {
                const newScale = parseFloat(e.target.value);
                setScale(newScale);
                localStorage.setItem('debug_scale', String(newScale));
              }}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`
              }}
            />
          </div>
          
          {/* Reset Button */}
          <button
            onClick={() => {
              const defaults = {
                brightness: 0.5,
                speed: 3.0,
                variation: 40,
                size: 1.2,
                blur: 1.0,
                opacity: 2.0, // 200% default
                position: 1.0
              };
              
              setOrbBrightness(defaults.brightness);
              setAnimationSpeed(defaults.speed);
              setColorVariation(defaults.variation);
              setOrbSize(defaults.size);
              setOrbBlur(defaults.blur);
              setOrbOpacity(defaults.opacity);
              setPositionVariation(defaults.position);
              
              // Force immediate localStorage update
              localStorage.setItem('orb_brightness', String(defaults.brightness));
              localStorage.setItem('animation_speed', String(defaults.speed));
              localStorage.setItem('color_variation', String(defaults.variation));
              localStorage.setItem('orb_size', String(defaults.size));
              localStorage.setItem('orb_blur', String(defaults.blur));
              localStorage.setItem('orb_opacity', String(defaults.opacity));
              localStorage.setItem('position_variation', String(defaults.position));
            }}
            className="w-full px-3 py-1.5 text-[10px] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-all"
          >
            RESET TO DEFAULT
          </button>
          
          {/* Reset Achievements Button - DEV ONLY */}
          <button
            onClick={() => {
              if (confirm('⚠️ Reset all achievements? This cannot be undone!')) {
                // Clear localStorage
                localStorage.removeItem('achievements');
                
                // Clear local state
                setAchievements([]);
                
                // Dispatch event to notify EasterEggs component
                window.dispatchEvent(new CustomEvent('achievements-reset'));
                
                // Show confirmation message
                console.log(
                  '%c🔄 Achievements reset! All achievements cleared.',
                  'color: #ef4444; font-size: 14px; font-weight: bold;'
                );
              }
            }}
            className="w-full px-3 py-1.5 text-[10px] text-red-400 hover:text-red-300 border border-red-700 hover:border-red-500 rounded transition-all"
          >
            RESET ACHIEVEMENTS
          </button>
        </div>

        {/* DIVIDER */}
        <div className="border-t-2 border-gray-800 my-3" style={{ borderColor: `rgba(${orbR}, ${orbG}, ${orbB}, 0.3)` }} />

        {/* ACHIEVEMENTS SECTION */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Achievements</span>
            <span className="text-[10px] text-gray-600">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </span>
          </div>
          
          {achievements.length > 0 ? (
            <div className="grid grid-cols-4 gap-1.5">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="relative" // Add relative for positioning tooltip
                  ref={(el) => { achievementRefs.current[achievement.id] = el; }}
                >
                  <div
                    className={`aspect-square flex items-center justify-center text-xl rounded border-2 transition-all cursor-pointer ${
                      achievement.unlocked 
                        ? 'border-yellow-400/50 bg-yellow-400/10' 
                        : 'border-gray-700 bg-gray-800/30 grayscale opacity-30'
                    }`}
                    onMouseEnter={() => {
                      // Desktop: hover to show tooltip (ignore on mobile to prevent double-tap issues)
                      if (!isMobile) {
                        setTooltip({ achievement, show: true });
                      }
                    }}
                    onMouseLeave={() => {
                      // Desktop: hide tooltip on mouse leave
                      if (!isMobile) {
                        if (tooltipTimeoutRef.current) {
                          clearTimeout(tooltipTimeoutRef.current);
                        }
                        setTooltip(null);
                      }
                    }}
                    onClick={(e) => {
                      // Mobile: click to toggle tooltip
                      // Prevent default to avoid ghost clicks
                      if (isMobile) {
                        e.stopPropagation();
                        
                        if (tooltip?.achievement.id === achievement.id) {
                          setTooltip(null);
                        } else {
                          setTooltip({ achievement, show: true });
                          // Auto-hide after 3 seconds on mobile
                          if (tooltipTimeoutRef.current) {
                            clearTimeout(tooltipTimeoutRef.current);
                          }
                          tooltipTimeoutRef.current = setTimeout(() => {
                            setTooltip(null);
                          }, 3000);
                        }
                      }
                    }}
                  >
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  
                  {/* Tooltip - positioned relative to THIS item */}
                  {tooltip?.achievement.id === achievement.id && (() => {
                    // Calculate tooltip position
                    const itemEl = achievementRefs.current[achievement.id];
                    let showBelow = false;
                    let alignLeft = false;
                    let alignRight = false;
                    
                    if (itemEl) {
                      const rect = itemEl.getBoundingClientRect();
                      const tooltipHeight = 120; // Approximate tooltip height
                      const tooltipWidth = 220; // Approximate tooltip width
                      const spaceAbove = rect.top;
                      const isMobileLocal = window.innerWidth < 768;
                      
                      // Check vertical positioning
                      if (isMobileLocal) {
                        // Mobile: check against viewport
                        showBelow = spaceAbove < tooltipHeight + 20;
                      } else {
                        // Desktop: check against panel bounds
                        const panelEl = panelRef.current;
                        if (panelEl) {
                          const panelRect = panelEl.getBoundingClientRect();
                          const relativeTop = rect.top - panelRect.top;
                          showBelow = relativeTop < tooltipHeight + 10;
                        }
                      }
                      
                      // Check horizontal positioning
                      const itemCenterX = rect.left + rect.width / 2;
                      const spaceLeft = itemCenterX;
                      const spaceRight = window.innerWidth - itemCenterX;
                      
                      // If tooltip would overflow left, align to left edge
                      if (spaceLeft < tooltipWidth / 2) {
                        alignLeft = true;
                      }
                      // If tooltip would overflow right, align to right edge
                      else if (spaceRight < tooltipWidth / 2) {
                        alignRight = true;
                      }
                    }
                    
                    return (
                      <div 
                        className={`absolute z-[9999] pointer-events-none ${
                          showBelow 
                            ? 'top-full mt-2' 
                            : '-top-2 -translate-y-full'
                        } ${
                          alignLeft 
                            ? 'left-0' 
                            : alignRight 
                              ? 'right-0' 
                              : 'left-1/2 -translate-x-1/2'
                        }`}
                        style={{
                          animation: 'fadeIn 0.2s ease-out'
                        }}
                      >
                        <div 
                          className="bg-gray-900 border-2 rounded-lg p-2 shadow-2xl min-w-[200px] max-w-[240px]"
                          style={{
                            borderColor: tooltip.achievement.unlocked 
                              ? `rgb(${orbR}, ${orbG}, ${orbB})` 
                              : 'rgb(107, 114, 128)',
                            boxShadow: tooltip.achievement.unlocked
                              ? `0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.4)`
                              : '0 4px 6px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <span className="text-lg">{tooltip.achievement.icon}</span>
                            <div className="flex-1">
                              <div className={`text-[10px] font-semibold ${
                                tooltip.achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                              }`}>
                                {tooltip.achievement.unlocked ? tooltip.achievement.name : '???'}
                              </div>
                            </div>
                          </div>
                          <div className="text-[9px] text-gray-400 mt-1">
                            {tooltip.achievement.unlocked 
                              ? tooltip.achievement.description
                              : ACHIEVEMENT_HINTS[tooltip.achievement.id] || 'Keep exploring...'}
                          </div>
                        </div>
                        {/* Arrow - flip based on position */}
                        {showBelow ? (
                          <div 
                            className={`absolute bottom-full w-0 h-0 ${
                              alignLeft 
                                ? 'left-6' 
                                : alignRight 
                                  ? 'right-6' 
                                  : 'left-1/2 -translate-x-1/2'
                            }`}
                            style={{
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderBottom: `6px solid ${tooltip.achievement.unlocked 
                                ? `rgb(${orbR}, ${orbG}, ${orbB})` 
                                : 'rgb(107, 114, 128)'}`
                            }}
                          />
                        ) : (
                          <div 
                            className={`absolute top-full w-0 h-0 ${
                              alignLeft 
                                ? 'left-6' 
                                : alignRight 
                                  ? 'right-6' 
                                  : 'left-1/2 -translate-x-1/2'
                            }`}
                            style={{
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderTop: `6px solid ${tooltip.achievement.unlocked 
                                ? `rgb(${orbR}, ${orbG}, ${orbB})` 
                                : 'rgb(107, 114, 128)'}`
                            }}
                          />
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-gray-600 text-center py-2">
              No achievements yet. Keep exploring!
            </div>
          )}
        </div>

        {/* Hint */}
        <div className="pt-2 border-t border-gray-800 text-gray-500 text-center text-[9px]">
          <div className="hidden md:block">Press 'D' to toggle</div>
        </div>
      </>
    );
  }
}