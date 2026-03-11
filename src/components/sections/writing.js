import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { Icon } from '@components/icons';

const StyledWritingSection = styled.section`
  max-width: 900px;

  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    margin-top: 50px;
    list-style: none;
    padding: 0;
  }

  .view-all {
    ${({ theme }) => theme.mixins.button};
    display: block;
    margin: 50px auto 0;
    width: max-content;
  }
`;

const StyledArticle = styled.li`
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover .article-inner {
      transform: translateY(-5px);
    }
  }

  .article-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.75rem 1.5rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .article-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 12px;

    .article-link {
      color: var(--light-slate);
      svg {
        width: 20px;
        height: 20px;
      }
      &:hover {
        color: var(--green);
      }
    }
  }

  .article-title {
    font-size: var(--fz-lg);
    font-weight: 600;
    color: var(--lightest-slate);
    margin: 0 0 10px;
    line-height: 1.4;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .article-subtitle {
    color: var(--light-slate);
    font-size: var(--fz-sm);
    flex-grow: 1;
    margin-bottom: 16px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-date {
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    color: var(--light-slate);
  }
`;

const Writing = () => {
  const data = useStaticQuery(graphql`
    query {
      allMediumPost(sort: { fields: pubDate, order: DESC }, limit: 6) {
        nodes {
          title
          link
          pubDate
          subtitle
        }
      }
    }
  `);

  const posts = data.allMediumPost?.nodes ?? [];
  const revealContainer = useRef(null);
  const revealItems = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealContainer.current, srConfig());
    revealItems.current.forEach((el, i) => sr.reveal(el, srConfig(i * 100)));
  }, []);

  if (!posts.length) return null;

  const formatDate = str => {
    try {
      return new Date(str).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (_) {
      return str;
    }
  };

  return (
    <StyledWritingSection id="writing" ref={revealContainer}>
      <h2 className="numbered-heading">Writing</h2>

      <ul className="articles-grid">
        {posts.map(({ title, link, pubDate, subtitle }, i) => (
          <StyledArticle key={i} ref={el => (revealItems.current[i] = el)}>
            <div className="article-inner">
              <div className="article-top">
                <span />
                <a
                  href={link}
                  className="article-link"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Read on Medium">
                  <Icon name="External" />
                </a>
              </div>

              <h3 className="article-title">
                <a href={link} target="_blank" rel="noreferrer">
                  {title}
                </a>
              </h3>

              {subtitle && <p className="article-subtitle">{subtitle}</p>}

              <p className="article-date">{formatDate(pubDate)}</p>
            </div>
          </StyledArticle>
        ))}
      </ul>

      <a
        href="https://medium.com/@yasser.namez"
        className="view-all"
        target="_blank"
        rel="noreferrer">
        View All Articles
      </a>
    </StyledWritingSection>
  );
};

export default Writing;
