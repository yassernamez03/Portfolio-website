import { css } from 'styled-components';

const variables = css`
  :root {
    --dark-navy: #09090b;
    --navy: #09090b;
    --light-navy: #111113;
    --lightest-navy: #1f1f23;
    --navy-shadow: rgba(0, 0, 0, 0.4);
    --dark-slate: #a1a1aa;
    --slate: #c4c4cf;
    --light-slate: #d4d4d8;
    --lightest-slate: #f4f4f5;
    --white: #ffffff;
    --green: #10b981;
    --green-secondary: #34d399;
    --green-tint: rgba(16, 185, 129, 0.14);
    --pink: #f472b6;
    --blue: #60a5fa;
    --border: rgba(255, 255, 255, 0.12);
    --surface: rgba(17, 17, 19, 0.85);

    --font-sans: 'Inter', 'Calibre', 'Space Grotesk', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 17px;
    --fz-xl: 18px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 10px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.2s ease;

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
