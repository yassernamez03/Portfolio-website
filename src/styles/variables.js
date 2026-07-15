import { css } from 'styled-components';

const variables = css`
  :root {
    --dark-navy: #FFFFFF;
    --navy: #FFFFFF;
    --light-navy: #F0F0F0;
    --lightest-navy: #D9D9D9;
    --navy-shadow: rgba(53, 53, 53, 0.25);
    --dark-slate: #3C6F71;
    --slate: #353535;
    --light-slate: #353535;
    --lightest-slate: #353535;
    --white: #353535;
    --green: #284B63;
    --green-secondary: #3C6F71;
    --green-tint: rgba(40, 75, 99, 0.1);
    --pink: #3C6F71;
    --blue: #284B63;
    --border: #D9D9D9;
    --surface: rgba(255, 255, 255, 0.88);

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
