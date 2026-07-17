'use client';

import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_SECTION_IDS = [
  'hero-section',
  'projects',
  'writing',
  'volunteering',
  'certifications',
  'contact',
];

const IDLE_ANIMATIONS = ['idle', 'jump', 'dance', 'sit'];
const ARRIVAL_DISTANCE = 1.5;
const CAT_Y_OFFSET = 18;

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getSectionTarget(sectionId) {
  if (sectionId === 'hero-section') {
    const heroName = document.getElementById('hero-name');

    if (heroName) {
      const rect = heroName.getBoundingClientRect();
      return {
        x: rect.right + window.scrollX + 72,
        y: rect.top + window.scrollY + rect.height / 2,
      };
    }
  }

  const section = document.getElementById(sectionId);
  if (!section) return null;

  const heading = section.querySelector('h2');
  const rect = (heading ?? section).getBoundingClientRect();

  return heading
    ? { x: rect.right + window.scrollX + 64, y: rect.top + window.scrollY + rect.height / 2 }
    : { x: rect.left + window.scrollX + 210, y: rect.top + window.scrollY + 56 };
}

/**
 * A fixed-position pixel cat that rests beside the currently visible section.
 * Click the cat to toggle cursor-follow mode.
 */
export default function PixelCat({
  sectionIds = DEFAULT_SECTION_IDS,
  size = 80,
  speed = 80,
  furColor = 'var(--green, #67b77a)',
  outlineColor = 'var(--navy, #14213d)',
  cheekColor = '#f2a7b8',
}) {
  const wrapperRef = useRef(null);
  const facingRef = useRef(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const activeSectionRef = useRef(sectionIds[0] ?? 'hero-section');
  const isFollowingRef = useRef(false);
  const isWalkingRef = useRef(false);
  const isRestingRef = useRef(false);
  const idleTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const toggleFollowRef = useRef(() => {});

  const [idleAnimation, setIdleAnimation] = useState('idle');
  const [isWalking, setIsWalking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [speechText, setSpeechText] = useState(null);
  const speechTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const wrapper = wrapperRef.current;
    const facingLayer = facingRef.current;
    if (!wrapper || !facingLayer) return undefined;

    const visibility = new Map();
    // const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    let previousTimestamp = performance.now();
    let facingDirection = 1;
    let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const setWalking = nextValue => {
      if (isWalkingRef.current === nextValue) return;
      isWalkingRef.current = nextValue;
      setIsWalking(nextValue);
    };

    const stopIdleCycle = () => {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
      isRestingRef.current = false;
      setIdleAnimation('idle');
      
      // Clear speech when moving
      window.clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
      setSpeechText(null);
    };

    const startIdleCycle = () => {
      if (isRestingRef.current || isFollowingRef.current) return;

      isRestingRef.current = true;

      const cycle = () => {
        if (!isRestingRef.current || isFollowingRef.current) return;

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

    const moveHome = () => {
      const target = getSectionTarget(activeSectionRef.current);
      if (target) targetRef.current = target;
      stopIdleCycle();
    };

    const toggleFollow = () => {
      isFollowingRef.current = !isFollowingRef.current;
      setIsFollowing(isFollowingRef.current);
      stopIdleCycle();

      if (!isFollowingRef.current) moveHome();
    };

    toggleFollowRef.current = toggleFollow;

    const updateActiveSection = () => {
      const nextSection = [...visibility.entries()]
        .filter(([, ratio]) => ratio >= 0.25)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      if (!nextSection || nextSection === activeSectionRef.current) return;

      activeSectionRef.current = nextSection;
      
      // Automatically wake up and start following when entering a new section
      if (!isFollowingRef.current) {
        isFollowingRef.current = true;
        setIsFollowing(true);
        targetRef.current = {
          x: lastMousePos.x + window.scrollX,
          y: lastMousePos.y + window.scrollY,
        };
        stopIdleCycle();
      }
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          visibility.set(entry.target.id, entry.intersectionRatio);
        });
        updateActiveSection();
      },
      {
        threshold: [0, 0.25, 0.4, 0.6, 0.8],
        rootMargin: '-8% 0px -35% 0px',
      },
    );

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    const initialTarget = getSectionTarget(activeSectionRef.current) ?? {
      x: window.innerWidth / 2,
      y: 160,
    };

    targetRef.current = initialTarget;
    currentRef.current = { ...initialTarget };
    wrapper.style.transform = `translate3d(${initialTarget.x}px, ${
      initialTarget.y - CAT_Y_OFFSET
    }px, 0) translate(-50%, -50%)`;
    wrapper.style.opacity = '1';

    const handlePointerMove = event => {
      lastMousePos = { x: event.clientX, y: event.clientY };
      if (!isFollowingRef.current) return;

      targetRef.current = {
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY,
      };
      stopIdleCycle();
    };

    const handlePointerLeave = () => {
      if (!isFollowingRef.current) return;

      isFollowingRef.current = false;
      setIsFollowing(false);
      moveHome();
    };

    const handleResize = () => {
      if (!isFollowingRef.current) moveHome();
    };

    const handleScroll = () => {
      if (isFollowingRef.current) {
        targetRef.current = {
          x: lastMousePos.x + window.scrollX,
          y: lastMousePos.y + window.scrollY,
        };
      }
    };

    const animate = timestamp => {
      const deltaSeconds = Math.min((timestamp - previousTimestamp) / 1000, 0.05);
      previousTimestamp = timestamp;

      const current = currentRef.current;
      const target = targetRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > ARRIVAL_DISTANCE) {
        const step = Math.min(distance, speed * deltaSeconds);
        current.x += (dx / distance) * step;
        current.y += (dy / distance) * step;
        setWalking(true);
        stopIdleCycle();
      } else {
        current.x = target.x;
        current.y = target.y;
        setWalking(false);

        if (!isFollowingRef.current) startIdleCycle();
      }

      if (Math.abs(dx) > 1) {
        facingDirection = dx > 0 ? 1 : -1;
        facingLayer.style.transform = `scaleX(${facingDirection})`;
      }

      wrapper.style.transform = `translate3d(${current.x}px, ${
        current.y - CAT_Y_OFFSET
      }px, 0) translate(-50%, -50%)`;

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(idleTimerRef.current);
      window.clearTimeout(speechTimerRef.current);
      toggleFollowRef.current = () => {};
    };
  }, [sectionIds, speed]);

  const motionClass = isWalking ? 'cat-walk' : `cat-${idleAnimation}`;

  const handleKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleFollowRef.current();
  };

  return (
    <button
      ref={wrapperRef}
      type="button"
      className={`pixel-cat ${motionClass}`}
      aria-label={
        isFollowing
          ? 'Stop the pixel cat from following the cursor'
          : 'Make the pixel cat follow the cursor'
      }
      aria-pressed={isFollowing}
      onClick={() => toggleFollowRef.current()}
      onKeyDown={handleKeyDown}
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
        cursor: 'pointer',
        zIndex: 9999,
        willChange: 'transform',
      }}>
      <style>{`
        .pixel-cat {
          display: grid;
          place-items: center;
          transition: opacity 180ms ease;
          -webkit-tap-highlight-color: transparent;
        }

        .pixel-cat:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 5px;
        }

        .pixel-cat-facing {
          width: 100%;
          height: 100%;
          transform-origin: center;
          will-change: transform;
        }

        .pixel-cat-svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
          transform-origin: 50% 75%;
          will-change: transform;
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

        .cat-walk .pixel-cat-svg {
          animation: catWalk 320ms steps(2, end) infinite;
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

        @keyframes catWalk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
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

        // @media (prefers-reduced-motion: reduce) {
        //   .pixel-cat *,
        //   .pixel-cat-svg,
        //   .pixel-cat-eye,
        //   .pixel-cat-tail {
        //     animation: none !important;
        //   }
        }
      `}</style>

      {speechText && (
        <div className="pixel-cat-speech">
          {speechText}
        </div>
      )}
      <span ref={facingRef} className="pixel-cat-facing" aria-hidden="true">
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
    </button>
  );
}
