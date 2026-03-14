import React from 'react';
import styled from 'styled-components';
import techIconMap from '@utils/techIcons';
import techLinks from '@utils/techLinks';

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  color: var(--light-slate);
  background-color: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: 20px;
  padding: 4px 10px;
  white-space: nowrap;
  text-decoration: none;

  &:hover,
  &:focus {
    color: var(--green);
    border-color: var(--green);
  }

  img {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
`;

const TechBadge = ({ name }) => {
  const slug = techIconMap[name];
  const website = techLinks[name];
  const WrapperTag = website ? 'a' : 'span';

  return (
    <StyledBadge
      as={WrapperTag}
      href={website || undefined}
      target={website ? '_blank' : undefined}
      rel={website ? 'noopener noreferrer' : undefined}
      aria-label={website ? `${name} website` : undefined}>
      {slug && (
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={name}
          width="13"
          height="13"
          onError={e => {
            e.target.style.display = 'none';
          }}
        />
      )}
      {name}
    </StyledBadge>
  );
};

export default TechBadge;
