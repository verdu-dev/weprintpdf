import type { DocOrientation, DocSize } from "@/lib/enums";

export interface Tool {
  createdAt: string;
  icon: string;
  name: string;
  description: string;
  category: string;
  slug: string;
}

export interface CalendarOptions {
  year: string,
  size: DocSize
  orientation: DocOrientation,
  sundays: boolean,
  image: string | null;
  multipage: boolean,
  holidays: boolean,
  labelHolidays: boolean,
  logo: {
    img: HTMLImageElement,
    format: string,
    aspectRatio: number
  } | null;
}

export interface CalendarDay {
  date: Date;
  day: number;
  weekday: number;
  month: number;
  iso: string;
  holiday?: boolean;
  holidayName?: string;
};

export type CalendarWeek = (CalendarDay | null)[];

export interface CalendarMonth {
  month: number;
  name: string;
  weeks: CalendarWeek[];
};

export interface CalendarYear {
  year: number;
  months: CalendarMonth[];
};

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: CountryCode;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: null;
  types: Type[];
}

export enum CountryCode {
  Es = "ES",
}

export enum Type {
  Public = "Public",
}