import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import TechBadge from '@components/TechBadge';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  gap: 44px;
`;

const StyledProject = styled.li`
  .project-card {
    display: grid;
    grid-template-columns: minmax(220px, 320px) 1fr;
    gap: 28px;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }

  .project-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .project-title {
    margin: 0;
    color: var(--lightest-slate);
    font-size: clamp(24px, 3.5vw, 34px);
    line-height: 1.2;

    a {
      color: inherit;
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--lightest-slate);
      }
    }
  }

  .project-description {
    margin: 0;
    color: var(--light-slate);
    font-size: var(--fz-md);
    line-height: 1.7;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    strong {
      color: var(--white);
      font-weight: normal;
    }
  }

  .project-stack {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 2px 0 0;
    color: var(--dark-slate);
    font-size: var(--fz-sm);
    line-height: 1.6;

    .label {
      color: var(--light-slate);
      margin-right: 2px;
    }
  }

  .project-tech-list {
    ${({ theme }) => theme.mixins.resetList};
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;

    li {
      margin: 0;
    }
  }

  .project-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--fz-sm);
      color: var(--lightest-slate);
      text-decoration: underline;
      text-decoration-color: rgba(255, 255, 255, 0.45);
      text-underline-offset: 3px;

      &:hover,
      &:focus-visible {
        color: var(--lightest-slate);
        text-decoration-color: var(--green);
      }

      svg {
        width: 14px;
        height: 14px;
      }
    }

    .separator {
      color: var(--dark-slate);
    }
  }

  .project-image {
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;

    a {
      display: block;
      width: 100%;
      min-height: 200px;
    }

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @media (max-width: 900px) {
    .project-image a {
      min-height: 180px;
    }
  }
`;

const StyledSectionHeader = styled.h2`
  margin: 0 0 34px;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.2;
`;

const getLinkIconName = url => {
  if (!url) {
    return null;
  }

  const normalizedUrl = url.toLowerCase();

  if (normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be')) {
    return 'YouTube';
  }

  if (normalizedUrl.includes('linkedin.com')) {
    return 'Linkedin';
  }

  return 'External';
};

const renderActionLinks = ({ github, externalLink, youtubeLink, linkedinLink }) => {
  const links = [];

  if (github) {
    links.push({ href: github, label: 'Repository', icon: 'GitHub' });
  }

  if (externalLink) {
    links.push({ href: externalLink, label: 'Demo', icon: 'External' });
  }

  if (youtubeLink) {
    links.push({ href: youtubeLink, label: 'Video', icon: 'YouTube' });
  }

  if (linkedinLink) {
    links.push({ href: linkedinLink, label: 'LinkedIn', icon: 'Linkedin' });
  }

  return links.map((link, index) => (
    <React.Fragment key={`${link.label}-${link.href}`}>
      {index > 0 && <span className="separator">|</span>}
      <a href={link.href} target="_blank" rel="noreferrer">
        <Icon name={link.icon} />
        {link.label}
      </a>
    </React.Fragment>
  ));
};

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(width: 700, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              tech
              github
              external
              youtube
              linkedin
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <section id="projects">
      <StyledSectionHeader ref={revealTitle}>
        Latest Projects
      </StyledSectionHeader>

      <StyledProjectsGrid>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, youtube, linkedin, title, tech, github, cover } = frontmatter;
            const image = getImage(cover);
            const externalIcon = getLinkIconName(external);
            const youtubeLink = youtube || (externalIcon === 'YouTube' ? external : null);
            const linkedinLink = linkedin || (externalIcon === 'Linkedin' ? external : null);
            const externalLink = externalIcon === 'External' ? external : null;
            const primaryLink = externalLink || youtubeLink || linkedinLink || github || '#';

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <article className="project-card">
                  <div className="project-image">
                    <a href={primaryLink} target="_blank" rel="noreferrer" aria-label={`${title} preview`}>
                      <GatsbyImage image={image} alt={title} className="img" />
                    </a>
                  </div>

                  <div className="project-content">
                    <h3 className="project-title">
                      <a href={primaryLink} target="_blank" rel="noreferrer">
                        {title}
                      </a>
                    </h3>

                    <div
                      className="project-description"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />

                    {tech.length > 0 && (
                      <div className="project-stack">
                        <span className="label">Stack:</span>
                        <ul className="project-tech-list">
                          {tech.map((item, index) => (
                            <li key={`${item}-${index}`}>
                              <TechBadge name={item} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="project-actions">
                      {renderActionLinks({ github, externalLink, youtubeLink, linkedinLink })}
                    </div>
                  </div>
                </article>
              </StyledProject>
            );
          })}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;
