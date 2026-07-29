'use client';

import React, { useEffect, useRef, useState } from 'react';

const IDLE_ANIMATIONS = ['idle', 'jump', 'dance', 'sit'];
const CAT_Y_OFFSET = 18;

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * A fixed-position pixel cat that rests beside the hero name.
 */
export default function PixelCat({
  size = 80,
  furColor = 'var(--green, #67b77a)',
  outlineColor = 'var(--navy, #14213d)',
  cheekColor = '#f2a7b8',
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState('idle');
  const [speechText, setSpeechText] = useState(null);
  
  const wrapperRef = useRef(null);
  const idleTimerRef = useRef(null);
  const speechTimerRef = useRef(null);
  const isRestingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    const handler = e => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Position next to the hero name
    const updatePosition = () => {
      const heroName = document.getElementById('hero-name');
      if (heroName && wrapper) {
        const rect = heroName.getBoundingClientRect();
        const x = rect.right + window.scrollX + 72;
        const y = rect.top + window.scrollY + rect.height / 2;
        
        wrapper.style.transform = `translate3d(${x}px, ${y - CAT_Y_OFFSET}px, 0) translate(-50%, -50%)`;
        wrapper.style.opacity = '1';
      }
    };

    // Initial position
    setTimeout(updatePosition, 100);
    
    // Update on resize
    window.addEventListener('resize', updatePosition);

    const startIdleCycle = () => {
      isRestingRef.current = true;

      const cycle = () => {
        if (!isRestingRef.current) return;

        setIdleAnimation(pickRandom(IDLE_ANIMATIONS));

        // 25% chance to say something cute when changing idle animation
        if (Math.random() < 0.25) {
          setSpeechText(pickRandom(['hello!', 'meow~', '*purr*', 'hi there!', '*nap time*']));
          window.clearTimeout(speechTimerRef.current);
          speechTimerRef.current = window.setTimeout(() => setSpeechText(null), 3000);
        }

        idleTimerRef.current = window.setTimeout(cycle, 2400 + Math.random() * 1800);
      };

      cycle();
    };

    startIdleCycle();

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.clearTimeout(idleTimerRef.current);
      window.clearTimeout(speechTimerRef.current);
      isRestingRef.current = false;
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={wrapperRef}
      className={`pixel-cat cat-${idleAnimation}`}
      style={{
        '--cat-fur': furColor,
        '--cat-outline': outlineColor,
        '--cat-cheek': cheekColor,
        position: 'absolute',
        left: 0,
        top: 0,
        width: size,
        height: size * 0.75,
        margin: 0,
        padding: 0,
        border: 0,
        background: 'transparent',
        opacity: 0,
        zIndex: 9999,
        willChange: 'transform',
      }}>
      <style>{`
        .pixel-cat {
          display: grid;
          place-items: center;
          transition: opacity 180ms ease;
        }

        @media (max-width: 768px) {
          .pixel-cat {
            display: none !important;
          }
        }

        .pixel-cat-facing {
          width: 100%;
          height: 100%;
          transform-origin: center;
        }

        .pixel-cat-svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
          transform-origin: 50% 75%;
        }

        .pixel-cat-speech {
          position: absolute;
          bottom: calc(100% - 10px);
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          background: white;
          color: var(--navy);
          border: 2px solid var(--cat-outline);
          border-radius: 8px;
          padding: 4px 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
          animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .pixel-cat-speech::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: var(--cat-outline) transparent transparent transparent;
        }

        .pixel-cat-speech::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-2px);
          border-width: 4px;
          border-style: solid;
          border-color: white transparent transparent transparent;
          z-index: 1;
        }

        @keyframes popIn {
          from { opacity: 0; transform: translateX(-50%) translateY(0) scale(0.8); }
          to { opacity: 1; transform: translateX(-50%) translateY(-10px) scale(1); }
        }

        .cat-jump .pixel-cat-svg {
          animation: catJump 600ms steps(1, end) infinite;
        }

        .cat-dance .pixel-cat-svg {
          animation: catDance 540ms steps(2, end) infinite alternate;
        }

        .cat-sit .pixel-cat-svg {
          animation: catBreathe 1800ms steps(2, end) infinite;
        }

        .pixel-cat-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: catBlink 4s steps(1, end) infinite;
        }

        .pixel-cat-tail {
          transform-box: fill-box;
          transform-origin: right center;
          animation: catTail 900ms steps(2, end) infinite alternate;
        }

        @keyframes catJump {
          0%, 100% { transform: translateY(0); }
          15%, 85% { transform: translateY(-4px); }
          30%, 70% { transform: translateY(-8px); }
          45%, 55% { transform: translateY(-12px); }
        }

        @keyframes catDance {
          from { transform: rotate(-4deg) translateY(-1px); }
          to { transform: rotate(4deg) translateY(-1px); }
        }

        @keyframes catBreathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: translateY(1px) scaleY(0.97); }
        }

        @keyframes catBlink {
          0%, 46%, 52%, 100% { transform: scaleY(1); }
          48%, 50% { transform: scaleY(0.15); }
        }

        @keyframes catTail {
          from { transform: rotate(-3deg); }
          to { transform: rotate(5deg); }
        }
      `}</style>

      {speechText && (
        <div className="pixel-cat-speech">
          {speechText}
        </div>
      )}
      <span className="pixel-cat-facing" aria-hidden="true">
        <svg
          className="pixel-cat-svg"
          viewBox="0 0 24 18"
          shapeRendering="crispEdges"
          xmlns="http://www.w3.org/2000/svg">
          {/* Curled tail: black outline under grey fill. */}
          <g className="pixel-cat-tail" fill="none" strokeLinecap="square" strokeLinejoin="miter">
            <path
              d="M8 13H5V14H3V13H2V12H1V8H2V6H3V5H5V6H6V8H5V7H4V8H3V11H4V12H7"
              stroke="var(--cat-outline)"
              strokeWidth="3"
            />
            <path
              d="M8 13H5V14H3V13H2V12H1V8H2V6H3V5H5V6H6V8H5V7H4V8H3V11H4V12H7"
              stroke="var(--cat-fur)"
              strokeWidth="1"
            />
          </g>

          {/* Body and tucked paws. */}
          <path fill="var(--cat-outline)" d="M6 11H10V9H20V10H22V13H21V15H20V17H7V16H5V13H6Z" />
          <path fill="var(--cat-fur)" d="M7 12H11V10H19V11H21V13H20V14H19V15H8V14H6V13H7Z" />

          {/* Head with stepped ears. */}
          <path
            fill="var(--cat-outline)"
            d="M10 0H12V1H13V2H14V3H18V2H19V1H20V0H22V10H21V12H20V13H12V12H11V10H10Z"
          />
          <path
            fill="var(--cat-fur)"
            d="M11 1H12V2H13V3H14V4H18V3H19V2H20V1H21V9H20V11H19V12H13V11H12V9H11Z"
          />

          {/* Eyes. */}
          <rect
            className="pixel-cat-eye"
            x="13"
            y="6"
            width="1"
            height="2"
            fill="var(--cat-outline)"
          />
          <rect
            className="pixel-cat-eye"
            x="18"
            y="6"
            width="1"
            height="2"
            fill="var(--cat-outline)"
          />

          {/* Pink cheeks. */}
          <rect x="11" y="8" width="2" height="1" fill="var(--cat-cheek)" />
          <rect x="19" y="8" width="2" height="1" fill="var(--cat-cheek)" />

          {/* Nose and tiny mouth. */}
          <rect x="16" y="8" width="1" height="1" fill="var(--cat-outline)" />
          <rect x="15" y="9" width="1" height="1" fill="var(--cat-outline)" />
          <rect x="17" y="9" width="1" height="1" fill="var(--cat-outline)" />

          {/* Front paws. */}
          <path
            fill="var(--cat-outline)"
            d="M10 12H13V14H15V15H11V14H10ZM18 12H21V14H20V15H16V14H18Z"
          />
          <rect x="11" y="12" width="1" height="1" fill="var(--cat-fur)" />
          <rect x="19" y="12" width="1" height="1" fill="var(--cat-fur)" />
        </svg>
      </span>
    </div>
  );
}
