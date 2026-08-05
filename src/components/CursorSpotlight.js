import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const SpotlightWrapper = styled.div`
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 30;
  transition: background 0.3s ease;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh),
    rgba(60, 110, 113, 0.08),
    transparent 80%
  );
`;

const CursorSpotlight = () => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <SpotlightWrapper ref={spotlightRef} />;
};

export default CursorSpotlight;
