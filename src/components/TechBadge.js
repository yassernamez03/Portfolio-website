import React from 'react';
import styled from 'styled-components';
import techIconMap from '@utils/techIcons';

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

  img {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
`;

const TechBadge = ({ name }) => {
  const slug = techIconMap[name];
  return (
    <StyledBadge>
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
