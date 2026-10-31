const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

export const Check = (p) => (
  <svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p) => (
  <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const Moon = (p) => (
  <svg {...base} {...p}><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" /></svg>
);

const OPTION_PATHS = {
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  drop: <path d="M12 3.5s6 6.2 6 10.5a6 6 0 01-12 0C6 9.700 12 3.500 12 3.500z" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3zM18.500 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />,
  heart: <path d="M12 20s-7-4.400-7-10a4 4 0 017-2.600A4 4 0 0119 10c0 5.600-7 10-7 10z" />,
  thumb: <path d="M7 11v9H4v-9h3zM7 11l4-7c1.500 0 2.500 1 2.200 2.500L12.800 9H19a2 2 0 012 2.300l-1 6A2 2 0 0118 19H7" />,
  question: (
    <>
      <path d="M9 9.500a3 3 0 115 2c-1.200.8-2 1.300-2 2.700" />
      <path d="M12 18v.1" />
    </>
  ),
};

export function OptionIcon({ name, ...rest }) {
  return OPTION_PATHS[name] ? <svg {...base} {...rest}>{OPTION_PATHS[name]}</svg> : null;
}
