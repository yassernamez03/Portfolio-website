import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledResumeSection = styled.section`
  @media (prefers-reduced-motion: no-preference) {
    .resume-card:hover,
    .resume-card:focus-within {
      transform: translateY(-5px);
    }
  }

  .resume-card {
    ${({ theme }) => theme.mixins.boxShadow};
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 760px;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    padding: 2rem 1.75rem;
    transition: var(--transition);

    @media (max-width: 768px) {
      padding: 1.75rem 1.5rem;
    }

    @media (max-width: 480px) {
      padding: 1.5rem 1.25rem;
    }
  }

  p {
    max-width: 60ch;
    margin-bottom: 0;
  }

  .resume-actions {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .resume-btn {
    ${({ theme }) => theme.mixins.button};
  }

  .resume-btn.secondary {
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

const Resume = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledResumeSection id="resume" ref={revealContainer}>
      <h2 className="numbered-heading">Resume</h2>

      <div className="resume-card">
        <p>
          Download my latest resume to see a concise overview of my software engineering internships,
          full-stack and AI projects, and technical skills across backend, frontend, and cloud tooling.
        </p>

        <div className="resume-actions">
          <a href="/resume.pdf" className="resume-btn" target="_blank" rel="noopener noreferrer">
            View Resume
          </a>

          <a href="/resume.pdf" className="resume-btn secondary" download>
            Download PDF
          </a>
        </div>
      </div>
    </StyledResumeSection>
  );
};

export default Resume;
