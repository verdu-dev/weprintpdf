import type jsPDF from "jspdf";
import type { CalendarDay, CalendarMonth, CalendarYear } from "@/lib/types";
import { MONTH_NAMES } from "@/lib/enums";
import { fontStyle } from "@/lib/consts";

export function isLeap(year: string | number) {
  return (+year % 4 === 0) && (+year % 100 !== 0 || +year % 400 === 0);
}

export function weekdayES(date: Date) {
  return (date.getDay() + 6) % 7
};

export function generateCalendar(year: number): CalendarYear {
  const totalDays = isLeap(year) ? 366 : 365;

  const days: CalendarDay[] = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(year, 0, i + 1);
    const yearDate = date.getFullYear().toString();
    const monthDate = (date.getMonth() + 1).toString().padStart(2, "0");
    const dayDate = date.getDate().toString().padStart(2, "0");

    return {
      date,
      day: date.getDate(),
      weekday: weekdayES(date),
      month: date.getMonth(),
      iso: `${yearDate}-${monthDate}-${dayDate}`,
    };
  });

  const months: CalendarMonth[] = Array.from({ length: 12 }, (_, m) => {
    const monthDays = days.filter((d) => d.month === m);
    const weeks: (CalendarDay | null)[][] = [];
    let currentWeek: (CalendarDay | null)[] = [];

    if (monthDays.length === 0) {
      weeks.push(Array.from({ length: 7 }, () => null));
      return { month: m, name: Object.values(MONTH_NAMES)[m], weeks };
    }

    const firstWeekday = monthDays[0].weekday;
    if (firstWeekday > 0) {
      currentWeek = Array.from({ length: firstWeekday }, () => null);
    }

    for (const d of monthDays) {
      currentWeek.push(d);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    return { month: m, name: Object.values(MONTH_NAMES)[m], weeks };
  });

  return { year, months };
}

export function splitArray<T>(arr: Array<T>, chunkSize: number) {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
}

export function debugBox(doc: jsPDF, x: number, y: number, width: number, height: number) {
  doc.setDrawColor(fontStyle.holidayColor);
  doc.setLineWidth(fontStyle.outlineWidth);
  doc.rect(x, y, width, height);
};

export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) => {
  let timeoutTimer: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeoutTimer);

    timeoutTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};