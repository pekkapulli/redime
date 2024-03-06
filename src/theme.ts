const ratio = 1.25;
const baseFontSize = 16;

const fontSizeNumber = (step: number): number => {
  const size = baseFontSize * Math.pow(ratio, step);
  return size;
};

const fontSize = (step: number): string => {
  const size = fontSizeNumber(step);
  return `font-size: ${size}px`;
};

const spacingRatio = 1.618;
const spacingBase = 4;

const spacingNumber = (step: number): number => {
  return spacingBase * Math.pow(spacingRatio, step);
};

const spacing = (step: number): string => {
  return `${spacingNumber(step)}px`;
};

const greys = ["#20262C", "#52595F", "#A5ABB0", "#D1D4D7", "#E7E7E7"];

const grey = (step: number): string => {
  return step < 0 ? "black" : step >= greys.length ? "white" : greys[step];
};

export const colors = {
  black: "black",
  white: "#ffffff",
  green: "#779D35",
  darkGreen: "#2E410C",
  grey,
};

export const theme = {
  fontBold: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 700;
    line-height: 1.5
  `,
  fontNormal: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5
  `,
  fontLabel: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 400
  `,
  fontLabelBold: `
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 700
  `,
  spacing,
  spacingNumber,
  fontSize,
  fontSizeNumber,
  colors,
};

export const breakpoints = {
  mobile: 480,
  mobilePlus: 640,
  tablet: 800,
  desktop: 1220,
};
