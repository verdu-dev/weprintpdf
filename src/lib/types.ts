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
  grid: "3,4" | "4,3" | "2,6" | "6,2",
  sundays: boolean,
  dayBox: boolean,
  textSize: "s" | "m" | "l"
  image: string | null;
  multipage: boolean,
  holydays: boolean,
  saints: boolean
}

export interface CalendarDay {
  date: Date;
  day: number;
  weekday: number;
  month: number;
  iso: string;
  isToday?: boolean;
  holiday?: boolean;
  holidayName?: string;
};

export interface CalendarMonth {
  month: number;
  name: string;
  weeks: (CalendarDay | null)[][];
};

export interface CalendarYear {
  year: number;
  months: CalendarMonth[];
};