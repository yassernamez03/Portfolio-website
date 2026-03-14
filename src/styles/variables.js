import { css } from 'styled-components';

const variables = css`
  :root {
    --dark-navy: #0b0f10;
    --navy: #0b0f10;
    --light-navy: #111827;
    --lightest-navy: #111827;
    --navy-shadow: rgba(11, 15, 16, 0.75);
    --dark-slate: #9ca3af;
    --slate: #9ca3af;
    --light-slate: #9ca3af;
    --lightest-slate: #e5e7eb;
    --white: #e5e7eb;
    --green: #14b8a6;
    --green-secondary: #2dd4bf;
    --green-tint: rgba(20, 184, 166, 0.15);
    --pink: #f472b6;
    --blue: #60a5fa;

    --font-sans: 'Space Grotesk', 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
