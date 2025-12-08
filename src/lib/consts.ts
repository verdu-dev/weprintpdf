export const CURRENT_YEAR = new Date().getFullYear().toString();

export const apiHolidays = (year: number | string) => `https://date.nager.at/api/v3/PublicHolidays/${year}/es`;

export const fontSize = {
  a4: {
    cover: 60,
    title: 28,
    base: 12,
    weekDays: 8,
    baseMultipage: 20,
    weekDaysMultipage: 12,
    holiday: 7
  },
  a3: {
    cover: 80,
    title: 40,
    base: 16,
    weekDays: 12,
    baseMultipage: 32,
    weekDaysMultipage: 16,
    holiday: 9
  }
}

export const spacing = {
  a4: {
    margin: 7,
    gap: 5,
    innerMargin: 3,
    titleHeight: 20,
    // weekDaysHeight = 10; TODO: make this work
  },
  a3: {
    margin: 7,
    gap: 5,
    innerMargin: 3,
    titleHeight: 30,
    // weekDaysHeight = 10; TODO: make this work
  }
}

export const fontStyle = {
  fontFamily: "inter",
  baseColor: "black",
  weekDaysColor: "gray",
  holidayColor: "red",
  outlineColor: "gray",
  outlineWidth: 0.1
}