import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

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

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
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

  const one = <h1>Hello, my name is</h1>;
  const two = <h2 className="big-heading">Yasser Namez</h2>;
  const three = <h3 className="medium-heading">Software Engineer | Full Stack &amp; AI/ML Applications</h3>;
  const four = (
    <>
      <p>
        <b>Engineering student with real production internship impact.</b>
      </p>

      <p>
        I build scalable full-stack applications and production-ready AI integrations using{' '}
        <a href="https://spring.io/projects/spring-boot">Spring Boot</a>,{' '}
        <a href="https://react.dev">React</a>,{' '}
        <a href="https://fastapi.tiangolo.com">FastAPI</a>, and{' '}
        <a href="https://www.postgresql.org">PostgreSQL</a>.
      </p>


      <p>
        My work includes ERP platforms serving 50+ users, async report pipelines with Celery/Redis,
        and medical imaging APIs delivering 92% model accuracy.
      </p>

      <p>
        On <a href="https://github.com/yassernamez03">GitHub</a>, I maintain 50+ public repositories,
        contribute actively across AI, security, and full-stack projects, and keep shipping production-grade
        engineering work.
      </p>
    </>
  );
  const five = (
    <a
      className="email-link"
      href="mailto:yasser.namez3@gmail.com"
      target="_blank"
      rel="noreferrer">
      Let&apos;s Connect
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
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
    </StyledHeroSection>
  );
};

export default Hero;
