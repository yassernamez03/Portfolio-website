import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What&apos;s Next?</h2>

      <h2 className="title">Get In Touch</h2>

      <p>
        I&apos;m currently looking for software engineering internship opportunities focused on
        full-stack development and AI/ML applications. If you have a role or collaboration in
        mind, feel free to reach out.
      </p>

      <p>
        I also share project demos and engineering walkthroughs on{' '}
        <a href="https://www.youtube.com/@mighty_programmer" className="inline-link">
          YouTube (@mighty_programmer)
        </a>
        .
      </p>

      <a className="email-link" href={`mailto:${email}`}>
        Send Email
      </a>
    </StyledContactSection>
  );
};

export default Contact;
