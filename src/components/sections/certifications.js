import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const certs = [
  {
    name: 'Associate AI Engineer for Developers',
    issuer: 'DataCamp',
    date: 'Feb 2026',
    url: 'https://www.datacamp.com/statement-of-accomplishment/track/yasser-namez',
  },
  {
    name: 'EF SET English Certificate (C2 Proficient)',
    issuer: 'EF SET',
    date: 'Jan 2026',
    url: 'https://cert.efset.org/en/aKehTx',
  },
  {
    name: 'Introduction to MongoDB',
    issuer: 'MongoDB',
    date: 'Dec 2025',
    url: 'https://learn.mongodb.com',
  },
  {
    name: 'AWS Academy Graduate – Cloud Foundations',
    issuer: 'Amazon Web Services (AWS)',
    date: 'Dec 2025',
    url: 'https://aws.amazon.com/training/',
  },
  {
    name: 'HCIA-Cloud Computing V5.5',
    issuer: 'Huawei',
    date: 'Nov 2025',
    url: 'https://e.huawei.com/en/talent/',
  },
  {
    name: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional',
    issuer: 'Oracle',
    date: 'Nov 2025',
    url: 'https://education.oracle.com',
  },
  {
    name: 'ISO/IEC 27001 Lead Auditor',
    issuer: 'Mastermind',
    date: 'Oct 2025',
    url: null,
  },
  {
    name: 'Discover and Train in CyberSecurity',
    issuer: 'Oracle',
    date: 'Oct 2025',
    url: null,
  },
  {
    name: 'LFS183: Introduction to Zero Trust',
    issuer: 'The Linux Foundation',
    date: 'Oct 2025',
    url: 'https://training.linuxfoundation.org',
  },
  {
    name: 'LFEL1010: XSS Exploits and Defenses',
    issuer: 'The Linux Foundation',
    date: 'Oct 2025',
    url: 'https://training.linuxfoundation.org',
  },
  {
    name: 'LFS101: Introduction to Linux',
    issuer: 'The Linux Foundation',
    date: 'Oct 2025',
    url: 'https://training.linuxfoundation.org',
  },
  {
    name: 'Introduction to OSINT',
    issuer: 'Security Blue Team',
    date: 'Sep 2025',
    url: 'https://securityblue.team',
  },
  {
    name: 'ISO/IEC 27001 Information Security Associate',
    issuer: 'SkillFront',
    date: 'Jun 2025',
    url: null,
  },
  {
    name: 'IT Essentials',
    issuer: 'Cisco',
    date: 'Jun 2025',
    url: 'https://www.netacad.com',
  },
  {
    name: 'Linux Unhatched',
    issuer: 'Cisco',
    date: 'May 2025',
    url: 'https://www.netacad.com',
  },
  {
    name: 'Linux Essentials',
    issuer: 'Cisco',
    date: 'May 2025',
    url: 'https://www.netacad.com',
  },
  {
    name: 'LFC108: Cybersecurity Essentials',
    issuer: 'The Linux Foundation',
    date: 'Mar 2025',
    url: 'https://training.linuxfoundation.org',
  },
  {
    name: 'Certified in Cybersecurity (CC)',
    issuer: 'ISC²',
    date: 'Mar 2025',
    url: null,
  },
  {
    name: 'Introduction to Transformer-Based NLP',
    issuer: 'NVIDIA',
    date: 'Feb 2025',
    url: 'https://learn.nvidia.com',
  },
  {
    name: 'CCNA: Introduction to Networks',
    issuer: 'Cisco',
    date: 'Jan 2025',
    url: 'https://www.netacad.com',
  },
  {
    name: 'Python Essentials 2',
    issuer: 'Cisco',
    date: 'Dec 2024',
    url: 'https://www.netacad.com',
  },
  {
    name: 'Python Essentials 1',
    issuer: 'Cisco',
    date: 'Dec 2024',
    url: 'https://www.netacad.com',
  },
  {
    name: 'HPC AI DAYS – Certificate of Attendance',
    issuer: 'UM6P – University Mohammed VI Polytechnic',
    date: 'Nov 2024',
    url: null,
  },
  {
    name: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: 'Jan 2024',
    url: 'https://www.coursera.org',
  },
  {
    name: 'Internet Society Encryption Course',
    issuer: 'Internet Society',
    date: 'Apr 2024',
    url: 'https://www.internetsociety.org',
  },
  {
    name: 'Data Science Orientation',
    issuer: 'Coursera',
    date: 'Apr 2024',
    url: 'https://www.coursera.org',
  },
];

const StyledCertificationsSection = styled.section`
  max-width: 900px;

  .certs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    grid-gap: 15px;
    margin-top: 50px;
    list-style: none;
    padding: 0;
    margin-left: 0;
  }
`;

const StyledCert = styled.li`
  position: relative;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .cert-inner {
        transform: translateY(-5px);
      }
    }
  }

  .cert-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 1.75rem 1.5rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .cert-name {
    font-size: var(--fz-md);
    font-weight: 600;
    color: var(--lightest-slate);
    margin: 0 0 8px;
    line-height: 1.3;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .cert-issuer {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--green);
    margin-bottom: 6px;
  }

  .cert-date {
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    color: var(--light-slate);
  }
`;

const Certifications = () => {
  const revealContainer = useRef(null);
  const revealItems = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealContainer.current, srConfig());
    revealItems.current.forEach((el, i) => sr.reveal(el, srConfig(i * 50)));
  }, []);

  return (
    <StyledCertificationsSection id="certifications" ref={revealContainer}>
      <h2 className="numbered-heading">Certifications</h2>
      <ul className="certs-grid">
        {certs.map(({ name, issuer, date, url }, i) => (
          <StyledCert key={i} ref={el => (revealItems.current[i] = el)}>
            <div className="cert-inner">
              <p className="cert-name">
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer">
                    {name}
                  </a>
                ) : (
                  name
                )}
              </p>
              <p className="cert-issuer">{issuer}</p>
              <p className="cert-date">Issued {date}</p>
            </div>
          </StyledCert>
        ))}
      </ul>
    </StyledCertificationsSection>
  );
};

export default Certifications;
