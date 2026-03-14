import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledResumeSection = styled.section`
  .resume-card {
    position: relative;
    max-width: 760px;
    border: 1px solid var(--lightest-navy);
    background: linear-gradient(140deg, rgba(100, 255, 218, 0.08), rgba(2, 12, 27, 0.92) 40%);
    border-radius: var(--border-radius);
    padding: 36px;
    box-shadow: 0 20px 40px -25px rgba(2, 12, 27, 0.9);

    @media (max-width: 768px) {
      padding: 28px;
    }

    @media (max-width: 480px) {
      padding: 22px;
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
    color: var(--lightest-slate);
    border-color: var(--lightest-slate);

    &:hover,
    &:focus {
      background-color: rgba(204, 214, 246, 0.08);
      color: var(--lightest-slate);
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
