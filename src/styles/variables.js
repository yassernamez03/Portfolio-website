import { css } from 'styled-components';

const variables = css`
  :root {
    --dark-navy: #051f20;
    --navy: #051f20;
    --light-navy: #0b2b26;
    --lightest-navy: #163832;
    --navy-shadow: rgba(5, 31, 32, 0.45);
    --dark-slate: #235347;
    --slate: #8eb69b;
    --light-slate: #8eb69b;
    --lightest-slate: #daf1de;
    --white: #ffffff;
    --green: #8eb69b;
    --green-secondary: #daf1de;
    --green-tint: rgba(142, 182, 155, 0.2);
    --pink: #daf1de;
    --blue: #235347;
    --border: rgba(218, 241, 222, 0.18);
    --surface: rgba(11, 43, 38, 0.88);

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
