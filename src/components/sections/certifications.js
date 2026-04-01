import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const certs = [
  {
    name: 'Foundation: Introduction to LangChain - Python',
    issuer: 'LangChain',
    date: 'Mar 2026',
    credentialId: 'iifton9kdy',
    url: 'https://academy.langchain.com/certificates/iifton9kdy',
  },
  {
    name: 'Microsoft Applied Skills: Create an AI agent',
    issuer: 'Microsoft',
    date: 'Mar 2026',
    credentialId: '89DA6A623D960E54',
    url: 'https://learn.microsoft.com/en-us/users/yassernamez-5125/credentials/89da6a623d960e54?ref=https%3A%2F%2Fwww.linkedin.com%2F',
  },
  {
    name: 'Red Hat System Administration II (RH134 - RHA) - Ver. 10',
    issuer: 'Red Hat',
    date: 'Mar 2026',
    url: 'https://www.credly.com/badges/78c0bdcf-fd0d-4ae6-8a70-f9bbb3cdabc4/linked_in_profile',
  },
  {
    name: 'Model Context Protocol: Advanced Topics',
    issuer: 'Anthropic',
    date: 'Mar 2026',
    credentialId: 'etqnv52typk7',
    url: 'https://verify.skilljar.com/c/etqnv52typk7',
  },
  {
    name: 'Introduction to Model Context Protocol',
    issuer: 'Anthropic',
    date: 'Mar 2026',
    credentialId: 'u8jwkjwagwxb',
    url: 'https://verify.skilljar.com/c/u8jwkjwagwxb',
  },
  {
    name: 'Associate AI Engineer for Developers',
    issuer: 'DataCamp',
    date: 'Feb 2026',
    url: 'https://www.datacamp.com/completed/statement-of-accomplishment/track/50d9c2d0ad5f8b201d333b030310fe87a42881b7?utm_medium=organic_social&utm_campaign=sharewidget&utm_content=soa&utm_source=copylink',
  },
  {
    name: 'Associate AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    date: 'Mar 2026',
    url: 'https://www.datacamp.com/completed/statement-of-accomplishment/track/e3940669961beaa65c77db42c127fbbec67c38c8',
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
    url: 'https://learn.mongodb.com/c/zfXtUUTsTeOXUoQNyRmJrw',
  },
  {
    name: 'AWS Academy Graduate – Cloud Foundations',
    issuer: 'Amazon Web Services (AWS)',
    date: 'Dec 2025',
    url: 'https://www.credly.com/badges/5752dceb-6c02-4a3b-a930-50341e7c2d23/linked_in_profile/',
  },
  {
    name: 'HCIA-Cloud Computing V5.5',
    issuer: 'Huawei',
    date: 'Nov 2025',
    url: 'https://drive.google.com/file/d/1uOc2W30olyzyf0q6kI7Vmz1NCngktbzn/view?pli=1',
  },
  {
    name: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional',
    issuer: 'Oracle',
    date: 'Nov 2025',
    url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6BF2F8D475240558B326D960731B69673DA1CC86BC26A06B0A63BBC7124AF69F',
  },
  {
    name: 'LFS101: Introduction to Linux',
    issuer: 'The Linux Foundation',
    date: 'Oct 2025',
    url: 'https://www.credly.com/badges/bd1aa3f7-a7e3-4f38-b11d-b97274b00379/linked_in_profile',
  },
  {
    name: 'IT Essentials',
    issuer: 'Cisco',
    date: 'Jun 2025',
    url: 'https://www.credly.com/badges/66116650-8282-4fe9-82ee-2b2093c66f42/linked_in_profile',
  },
  {
    name: 'Linux Unhatched',
    issuer: 'Cisco',
    date: 'May 2025',
    url: 'https://www.credly.com/badges/e68a8008-c804-4fb5-9223-a876eeb6cbb8/linked_in_profile',
  },
  {
    name: 'Linux Essentials',
    issuer: 'Cisco',
    date: 'May 2025',
    url: 'https://www.credly.com/badges/287980b3-935e-43d6-8e4c-1bff0a05cd40/linked_in_profile',
  },
  {
    name: 'Introduction to Transformer-Based NLP',
    issuer: 'NVIDIA',
    date: 'Feb 2025',
    url: 'https://drive.google.com/file/d/1GR9gSCWPiNDT2ZtM1rjwIeUiR5osNxiC/view?usp=sharing',
  },
  {
    name: 'CCNA: Introduction to Networks',
    issuer: 'Cisco',
    date: 'Jan 2025',
    url: 'https://www.credly.com/badges/fc3ef0de-f616-4216-97dd-af6c26186946/linked_in_profile',
  },
  {
    name: 'Python Essentials 2',
    issuer: 'Cisco',
    date: 'Dec 2024',
    url: 'https://www.credly.com/badges/62cd9565-4028-49f4-b073-a1f28e093db5/linked_in_profile',
  },
  {
    name: 'Python Essentials 1',
    issuer: 'Cisco',
    date: 'Dec 2024',
    url: 'https://www.credly.com/badges/1ba8cb1e-314e-412c-96fc-1af55b70ba03/linked_in_profile',
  },
  {
    name: 'HPC AI DAYS – Certificate of Attendance',
    issuer: 'UM6P – University Mohammed VI Polytechnic',
    date: 'Nov 2024',
    url: 'https://drive.google.com/file/d/1rPpJojAkT6s9Zd4dgB7dl_0nm1rJh_Tr/view?usp=sharing',
  },
  {
    name: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: 'Jan 2024',
    url: 'https://drive.google.com/file/d/1CiMAvsg8QpMbQ9_qwaNfbKIgdSmHMx1_/view?usp=sharing',
  },
  {
    name: 'Internet Society Encryption Course',
    issuer: 'Internet Society',
    date: 'Apr 2024',
    url: 'https://certificates.isoc.org/27c249c1-5159-423f-bed3-5ce2082047ba#acc.UxeMEzly',
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
