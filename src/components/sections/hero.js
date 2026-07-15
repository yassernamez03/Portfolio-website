import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import pixelCat from '../../images/pixel-cat.gif';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  .hero-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    
    @media (max-width: 768px) {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
  }

  .hero-graphic {
    flex-shrink: 0;
    max-width: 200px;
    margin-left: 60px;
    
    img {
      width: 100%;
      height: auto;
      /* If the GIF background isn't perfectly transparent, blending might help, but let's assume it's good */
    }

    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 30px;
      max-width: 150px;
    }
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-intro {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  .hero-tagline {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .cta-group {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 50px;
  }

  .cta-link {
    ${({ theme }) => theme.mixins.bigButton};
  }

  .cta-link.secondary {
    background-color: transparent;
    color: var(--light-slate);
    border-color: var(--light-slate);

    &:hover,
    &:focus {
      background-color: var(--green-tint);
      color: var(--green-secondary);
      border-color: var(--green-secondary);
    }
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <p className="hero-intro">Hello, my name is</p>;
  const two = <h1 className="big-heading">Yasser Namez</h1>;
  const three = (
    <h2 className="medium-heading hero-tagline">
      Software Engineering student
    </h2>
  );
  const four = (
    <>
      <p>
        Here I document my journey and share insights along with the small gems I discover on the internet. 
      </p>
    </>
  );
  const five = (
    <div className="cta-group">
      <a
        className="cta-link"
        href="mailto:yasser.namez3@gmail.com"
        target="_blank"
        rel="noreferrer">
        Let&apos;s Connect
      </a>
      <a href="/resume.pdf" className="cta-link secondary" download>
        Download Resume
      </a>
    </div>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      <div className="hero-container">
        <div className="hero-content">
          {prefersReducedMotion ? (
            <>
              {items.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </>
          ) : (
            <TransitionGroup component={null}>
              {isMounted &&
                items.map((item, i) => (
                  <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                    <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          )}
        </div>

        <div className="hero-graphic">
          {prefersReducedMotion ? (
            <img src={pixelCat} alt="Pixelated Cat" />
          ) : (
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames="fadeup" timeout={loaderDelay}>
                  <div style={{ transitionDelay: '100ms' }}>
                    <img src={pixelCat} alt="Pixelated Cat" />
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          )}
        </div>
      </div>
    </StyledHeroSection>
  );
};

export default Hero;
