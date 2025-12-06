export const CURRENT_YEAR = new Date().getFullYear().toString();

const scaleFactor = 1.4141414141;
const base = 12;

export const fontSizeA4 = {
  title: 28,

  base,
  weekDays: base / scaleFactor,

  baseMultipage: base * (scaleFactor * scaleFactor),
  weekDaysMultipage: base,
  holiday: 7
}

export const fontSizeA3 = {
  title: 28,

  base: base * scaleFactor,
  weekDays: base,

  baseMultipage: (base * scaleFactor) * (scaleFactor * scaleFactor),
  weekDaysMultipage: base * scaleFactor,
  holiday: 9
}