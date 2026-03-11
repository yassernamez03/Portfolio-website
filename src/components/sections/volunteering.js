import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const volunteers = [
  {
    role: 'Technical Lead · CTF Challenge Developer',
    org: 'ENSET Challenge – N7SEC / N7Geeks / GDG On Campus ENSET-M',
    range: '2025 – Present',
    type: 'Cybersecurity',
    description:
      "Co-organizing Morocco's premier student cybersecurity competition as part of the Global Entrepreneurship & Innovation Week at ENSET Mohammedia. Designing and developing CTF challenges across Web Exploitation, Cryptography, Binary Analysis, and Network & Forensics, and contributing to the competition platform infrastructure for the online qualifiers and the 12-hour on-site finals.",
  },
  {
    role: 'Core Team Member · Tech Lead',
    org: 'Google Developer Groups on Campus – ENSET Mohammedia',
    range: 'Oct 2025 – Present',
    type: 'Education',
    description:
      'Leading technical initiatives and workshops within the GDG on Campus community, organizing developer events and mentoring fellow students in software and cloud technologies.',
  },
  {
    role: 'Core Team Member · Tech Lead',
    org: 'N7 Geeks',
    range: 'Oct 2024 – Nov 2025',
    type: 'Education',
    description:
      'Contributed to the technical direction of N7 Geeks, coordinating coding sessions, hackathon preparation, and knowledge-sharing activities across the campus engineering community.',
  },
  {
    role: 'Member',
    org: 'ENSPEC – ENSET Mohammedia',
    range: 'Oct 2024 – Nov 2025',
    type: 'Education',
    description:
      'Active member of ENSPEC, participating in student-led engineering projects, academic events, and collaborative initiatives within the ENSET Mohammedia community.',
  },
];

const StyledVolunteeringSection = styled.section`
  max-width: 900px;

  .vol-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 15px;
    margin-top: 50px;
    list-style: none;
    padding: 0;
  }
`;

const StyledCard = styled.li`
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover .card-inner {
      transform: translateY(-5px);
    }
  }

  .card-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.75rem 1.5rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .vol-role {
    font-size: var(--fz-lg);
    font-weight: 600;
    color: var(--lightest-slate);
    margin: 0 0 6px;
    line-height: 1.3;
  }

  .vol-org {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--green);
    margin-bottom: 4px;
  }

  .vol-range {
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    color: var(--light-slate);
    margin-bottom: 14px;
  }

  .vol-description {
    font-size: var(--fz-sm);
    color: var(--light-slate);
    line-height: 1.6;
    flex-grow: 1;
  }
`;

const Volunteering = () => {
  const revealContainer = useRef(null);
  const revealItems = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealContainer.current, srConfig());
    revealItems.current.forEach((el, i) => sr.reveal(el, srConfig(i * 100)));
  }, []);

  return (
    <StyledVolunteeringSection id="volunteering" ref={revealContainer}>
      <h2 className="numbered-heading">Volunteering</h2>

      <ul className="vol-grid">
        {volunteers.map(({ role, org, range, description }, i) => (
          <StyledCard key={i} ref={el => (revealItems.current[i] = el)}>
            <div className="card-inner">
              <p className="vol-role">{role}</p>
              <p className="vol-org">{org}</p>
              <p className="vol-range">{range}</p>
              <p className="vol-description">{description}</p>
            </div>
          </StyledCard>
        ))}
      </ul>
    </StyledVolunteeringSection>
  );
};

export default Volunteering;
