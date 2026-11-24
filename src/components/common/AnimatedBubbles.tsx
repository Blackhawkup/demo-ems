import React from 'react';

// Exact bubble distribution based on reference image, scaled and distributed across the full viewport / panel box
interface Bubble {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  r: number; // radius in SVG units
  animClass: string;
  delay: string;
  darkColor: string;
  lightColor: string;
  darkOpacity: number;
  lightOpacity: number;
  glow?: boolean;
}

const FULL_BOX_BUBBLES: Bubble[] = [
  // --- Center-Right Primary Cluster (From reference image) ---
  { id: 1, x: 62.5, y: 42.5, r: 14.0, lightColor: '#0f172a', darkColor: '#38bdf8', lightOpacity: 0.95, darkOpacity: 0.85, animClass: 'animate-bubble-float-1', delay: '0s', glow: true },
  { id: 2, x: 44.5, y: 53.5, r: 10.5, lightColor: '#1e293b', darkColor: '#094897', lightOpacity: 0.92, darkOpacity: 0.9, animClass: 'animate-bubble-float-2', delay: '0.6s' },
  { id: 3, x: 83.1, y: 21.0, r: 7.2, lightColor: '#094897', darkColor: '#60a5fa', lightOpacity: 0.9, darkOpacity: 0.85, animClass: 'animate-bubble-float-3', delay: '1.2s', glow: true },
  { id: 4, x: 81.3, y: 37.7, r: 7.0, lightColor: '#1e293b', darkColor: '#13A28F', lightOpacity: 0.92, darkOpacity: 0.8, animClass: 'animate-bubble-float-4', delay: '0.4s' },
  { id: 5, x: 65.7, y: 27.9, r: 6.8, lightColor: '#0f172a', darkColor: '#094897', lightOpacity: 0.95, darkOpacity: 0.9, animClass: 'animate-bubble-float-2', delay: '1.8s' },
  { id: 6, x: 52.1, y: 36.2, r: 6.8, lightColor: '#334155', darkColor: '#38bdf8', lightOpacity: 0.88, darkOpacity: 0.75, animClass: 'animate-bubble-float-1', delay: '2.4s' },
  { id: 7, x: 76.0, y: 61.8, r: 7.0, lightColor: '#0f172a', darkColor: '#1e40af', lightOpacity: 0.92, darkOpacity: 0.85, animClass: 'animate-bubble-float-3', delay: '0.8s' },
  { id: 8, x: 45.4, y: 76.0, r: 7.0, lightColor: '#1e293b', darkColor: '#60a5fa', lightOpacity: 0.9, darkOpacity: 0.85, animClass: 'animate-bubble-float-4', delay: '1.5s', glow: true },
  { id: 9, x: 71.6, y: 76.0, r: 6.8, lightColor: '#094897', darkColor: '#094897', lightOpacity: 0.92, darkOpacity: 0.9, animClass: 'animate-bubble-float-2', delay: '2.1s' },
  { id: 10, x: 59.3, y: 63.4, r: 6.6, lightColor: '#1e293b', darkColor: '#13A28F', lightOpacity: 0.9, darkOpacity: 0.8, animClass: 'animate-bubble-float-1', delay: '1.0s' },

  // Medium satellites in core cluster
  { id: 11, x: 73.4, y: 22.3, r: 3.6, lightColor: '#475569', darkColor: '#93c5fd', lightOpacity: 0.88, darkOpacity: 0.9, animClass: 'animate-bubble-float-3', delay: '0.3s' },
  { id: 12, x: 82.8, y: 50.7, r: 3.5, lightColor: '#1e293b', darkColor: '#38bdf8', lightOpacity: 0.9, darkOpacity: 0.8, animClass: 'animate-bubble-float-4', delay: '1.7s' },
  { id: 13, x: 71.6, y: 51.6, r: 3.6, lightColor: '#094897', darkColor: '#60a5fa', lightOpacity: 0.92, darkOpacity: 0.85, animClass: 'animate-bubble-float-1', delay: '2.2s' },
  { id: 14, x: 58.1, y: 54.1, r: 3.5, lightColor: '#334155', darkColor: '#094897', lightOpacity: 0.88, darkOpacity: 0.9, animClass: 'animate-bubble-float-2', delay: '0.9s' },
  { id: 15, x: 27.9, y: 76.8, r: 3.5, lightColor: '#0f172a', darkColor: '#13A28F', lightOpacity: 0.92, darkOpacity: 0.8, animClass: 'animate-bubble-float-3', delay: '1.4s' },
  { id: 16, x: 51.9, y: 81.6, r: 3.6, lightColor: '#1e293b', darkColor: '#38bdf8', lightOpacity: 0.9, darkOpacity: 0.85, animClass: 'animate-bubble-float-4', delay: '2.0s' },
  { id: 17, x: 49.0, y: 18.7, r: 3.4, lightColor: '#094897', darkColor: '#0284c7', lightOpacity: 0.88, darkOpacity: 0.8, animClass: 'animate-bubble-float-1', delay: '0.7s' },
  { id: 18, x: 49.2, y: 68.4, r: 3.4, lightColor: '#475569', darkColor: '#93c5fd', lightOpacity: 0.85, darkOpacity: 0.9, animClass: 'animate-bubble-float-2', delay: '1.3s' },
  { id: 19, x: 82.1, y: 71.8, r: 3.4, lightColor: '#0f172a', darkColor: '#094897', lightOpacity: 0.9, darkOpacity: 0.85, animClass: 'animate-bubble-float-3', delay: '2.6s' },
  { id: 20, x: 60.7, y: 78.4, r: 3.4, lightColor: '#1e293b', darkColor: '#60a5fa', lightOpacity: 0.88, darkOpacity: 0.85, animClass: 'animate-bubble-float-4', delay: '0.5s' },
  { id: 21, x: 75.9, y: 79.2, r: 3.4, lightColor: '#334155', darkColor: '#1e40af', lightOpacity: 0.88, darkOpacity: 0.9, animClass: 'animate-bubble-float-1', delay: '1.9s' },
  { id: 22, x: 32.8, y: 44.3, r: 3.2, lightColor: '#094897', darkColor: '#38bdf8', lightOpacity: 0.85, darkOpacity: 0.8, animClass: 'animate-bubble-float-2', delay: '2.3s' },

  // Fine specks in core
  { id: 23, x: 75.9, y: 14.7, r: 1.8, lightColor: '#0f172a', darkColor: '#ffffff', lightOpacity: 0.9, darkOpacity: 0.9, animClass: 'animate-bubble-float-4', delay: '0.2s' },
  { id: 24, x: 16.1, y: 59.2, r: 1.8, lightColor: '#475569', darkColor: '#60a5fa', lightOpacity: 0.85, darkOpacity: 0.75, animClass: 'animate-bubble-float-3', delay: '1.1s' },
  { id: 25, x: 33.6, y: 67.2, r: 1.8, lightColor: '#1e293b', darkColor: '#38bdf8', lightOpacity: 0.88, darkOpacity: 0.8, animClass: 'animate-bubble-float-1', delay: '2.5s' },
  { id: 26, x: 73.7, y: 67.5, r: 1.8, lightColor: '#094897', darkColor: '#93c5fd', lightOpacity: 0.85, darkOpacity: 0.85, animClass: 'animate-bubble-float-2', delay: '0.8s' },
  { id: 27, x: 9.2, y: 80.9, r: 1.8, lightColor: '#0f172a', darkColor: '#13A28F', lightOpacity: 0.9, darkOpacity: 0.7, animClass: 'animate-bubble-float-4', delay: '1.6s' },
  { id: 28, x: 64.5, y: 14.5, r: 1.6, lightColor: '#334155', darkColor: '#ffffff', lightOpacity: 0.88, darkOpacity: 0.85, animClass: 'animate-bubble-float-3', delay: '2.7s' },
  { id: 29, x: 34.7, y: 36.2, r: 1.6, lightColor: '#1e293b', darkColor: '#60a5fa', lightOpacity: 0.85, darkOpacity: 0.75, animClass: 'animate-bubble-float-1', delay: '0.4s' },
  { id: 30, x: 51.2, y: 44.6, r: 1.6, lightColor: '#094897', darkColor: '#094897', lightOpacity: 0.88, darkOpacity: 0.8, animClass: 'animate-bubble-float-2', delay: '1.8s' },
  { id: 31, x: 75.3, y: 44.6, r: 1.6, lightColor: '#0f172a', darkColor: '#38bdf8', lightOpacity: 0.9, darkOpacity: 0.85, animClass: 'animate-bubble-float-4', delay: '2.2s' },
  { id: 32, x: 33.4, y: 55.6, r: 1.6, lightColor: '#475569', darkColor: '#93c5fd', lightOpacity: 0.85, darkOpacity: 0.8, animClass: 'animate-bubble-float-3', delay: '0.6s' },
  { id: 33, x: 85.3, y: 65.0, r: 1.6, lightColor: '#1e293b', darkColor: '#094897', lightOpacity: 0.88, darkOpacity: 0.75, animClass: 'animate-bubble-float-1', delay: '1.4s' },
  { id: 34, x: 85.3, y: 80.8, r: 1.6, lightColor: '#094897', darkColor: '#38bdf8', lightOpacity: 0.85, darkOpacity: 0.8, animClass: 'animate-bubble-float-2', delay: '2.8s' },

  // --- Extended Constellation across the UPPER and LEFT quadrants to fill the ENTIRE BOX ---
  { id: 35, x: 22.0, y: 18.0, r: 11.0, lightColor: '#0f172a', darkColor: '#094897', lightOpacity: 0.92, darkOpacity: 0.75, animClass: 'animate-bubble-float-1', delay: '1.1s', glow: true },
  { id: 36, x: 12.0, y: 28.0, r: 6.5, lightColor: '#094897', darkColor: '#38bdf8', lightOpacity: 0.88, darkOpacity: 0.8, animClass: 'animate-bubble-float-3', delay: '2.0s' },
  { id: 37, x: 28.0, y: 25.0, r: 4.5, lightColor: '#1e293b', darkColor: '#60a5fa', lightOpacity: 0.88, darkOpacity: 0.85, animClass: 'animate-bubble-float-2', delay: '0.5s' },
  { id: 38, x: 18.0, y: 38.0, r: 7.5, lightColor: '#334155', darkColor: '#13A28F', lightOpacity: 0.85, darkOpacity: 0.75, animClass: 'animate-bubble-float-4', delay: '1.8s' },
  { id: 39, x: 10.0, y: 12.0, r: 3.0, lightColor: '#475569', darkColor: '#93c5fd', lightOpacity: 0.85, darkOpacity: 0.7, animClass: 'animate-bubble-float-1', delay: '0.9s' },
  { id: 40, x: 35.0, y: 12.0, r: 5.0, lightColor: '#094897', darkColor: '#1e40af', lightOpacity: 0.9, darkOpacity: 0.8, animClass: 'animate-bubble-float-2', delay: '2.5s' },

  // --- Extended Constellation across the LOWER and BOTTOM quadrants ---
  { id: 41, x: 18.0, y: 88.0, r: 9.5, lightColor: '#0f172a', darkColor: '#38bdf8', lightOpacity: 0.92, darkOpacity: 0.75, animClass: 'animate-bubble-float-3', delay: '1.6s', glow: true },
  { id: 42, x: 32.0, y: 92.0, r: 5.5, lightColor: '#1e293b', darkColor: '#094897', lightOpacity: 0.9, darkOpacity: 0.85, animClass: 'animate-bubble-float-1', delay: '2.2s' },
  { id: 43, x: 65.0, y: 90.0, r: 8.0, lightColor: '#094897', darkColor: '#60a5fa', lightOpacity: 0.88, darkOpacity: 0.8, animClass: 'animate-bubble-float-4', delay: '0.7s' },
  { id: 44, x: 82.0, y: 92.0, r: 4.5, lightColor: '#334155', darkColor: '#13A28F', lightOpacity: 0.85, darkOpacity: 0.75, animClass: 'animate-bubble-float-2', delay: '1.9s' },
  { id: 45, x: 92.0, y: 78.0, r: 6.0, lightColor: '#0f172a', darkColor: '#0284c7', lightOpacity: 0.9, darkOpacity: 0.7, animClass: 'animate-bubble-float-1', delay: '1.3s' },
  { id: 46, x: 92.0, y: 32.0, r: 5.5, lightColor: '#1e293b', darkColor: '#93c5fd', lightOpacity: 0.88, darkOpacity: 0.8, animClass: 'animate-bubble-float-3', delay: '2.7s' },
  { id: 47, x: 90.0, y: 15.0, r: 3.5, lightColor: '#094897', darkColor: '#38bdf8', lightOpacity: 0.85, darkOpacity: 0.75, animClass: 'animate-bubble-float-4', delay: '0.4s' },
  { id: 48, x: 8.0, y: 72.0, r: 4.0, lightColor: '#475569', darkColor: '#1e40af', lightOpacity: 0.85, darkOpacity: 0.8, animClass: 'animate-bubble-float-2', delay: '1.2s' },
  { id: 49, x: 5.0, y: 48.0, r: 3.0, lightColor: '#1e293b', darkColor: '#60a5fa', lightOpacity: 0.85, darkOpacity: 0.7, animClass: 'animate-bubble-float-1', delay: '2.1s' },
  { id: 50, x: 50.0, y: 5.0, r: 4.2, lightColor: '#0f172a', darkColor: '#38bdf8', lightOpacity: 0.88, darkOpacity: 0.75, animClass: 'animate-bubble-float-3', delay: '0.8s' },
];

interface AnimatedBubblesProps {
  className?: string;
  theme?: 'light' | 'dark';
  opacity?: number;
}

export const AnimatedBubbles: React.FC<AnimatedBubblesProps> = ({
  className = '',
  theme = 'dark',
  opacity = 0.85,
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        <defs>
          {theme === 'light' ? (
            <>
              {/* Soft subtle shadow for floating depth on white */}
              <filter id="lightBubbleShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#0f172a" floodOpacity="0.18" />
              </filter>

              {/* Sphere depth gradient for large bubbles on white */}
              <radialGradient id="sphereGradDark" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              <radialGradient id="sphereGradNavy" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="55%" stopColor="#094897" />
                <stop offset="100%" stopColor="#021c3b" />
              </radialGradient>
            </>
          ) : (
            <>
              <filter id="bubbleCyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor="#38bdf8" floodOpacity="0.75" />
              </filter>
              <filter id="bubbleRoyalGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#094897" floodOpacity="0.8" />
              </filter>

              {/* Luminous radial sphere gradients for dark theme */}
              <radialGradient id="sphereGradCyan" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="45%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0369a1" />
              </radialGradient>

              <radialGradient id="sphereGradRoyal" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#094897" />
                <stop offset="100%" stopColor="#021c3b" />
              </radialGradient>

              <radialGradient id="sphereGradTeal" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#5eead4" />
                <stop offset="50%" stopColor="#13A28F" />
                <stop offset="100%" stopColor="#042f2e" />
              </radialGradient>
            </>
          )}
        </defs>

        {FULL_BOX_BUBBLES.map((bubble) => {
          const isLarge = bubble.r > 7;
          let fill = theme === 'light' ? bubble.lightColor : bubble.darkColor;
          const currentOpacity = theme === 'light' ? bubble.lightOpacity : bubble.darkOpacity;

          if (theme === 'light' && isLarge) {
            fill = bubble.id % 2 === 0 ? 'url(#sphereGradNavy)' : 'url(#sphereGradDark)';
          } else if (theme === 'dark' && isLarge) {
            const isCyan = bubble.darkColor === '#38bdf8' || bubble.darkColor === '#93c5fd';
            const isTeal = bubble.darkColor === '#13A28F';
            fill = isCyan ? 'url(#sphereGradCyan)' : isTeal ? 'url(#sphereGradTeal)' : 'url(#sphereGradRoyal)';
          }

          return (
            <circle
              key={bubble.id}
              cx={bubble.x}
              cy={bubble.y}
              r={bubble.r * 0.44}
              fill={fill}
              fillOpacity={currentOpacity}
              className={`${bubble.animClass} transition-all duration-700`}
              style={{
                animationDelay: bubble.delay,
                transformOrigin: `${bubble.x}% ${bubble.y}%`,
                filter: theme === 'light' && isLarge 
                  ? 'url(#lightBubbleShadow)' 
                  : theme === 'dark' && bubble.glow 
                  ? 'url(#bubbleCyanGlow)' 
                  : undefined,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default AnimatedBubbles;
