module.exports = {
  email: 'yasser.namez3@gmail.com',

  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/yassernamez03',
    },
    {
      name: 'Linkedin',
      url: 'https://linkedin.com/in/yasser-namez-0898a322b',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@mighty_programmer',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  colors: {
    green: '#22d3ee',
    navy: '#030712',
    darkNavy: '#020617',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
