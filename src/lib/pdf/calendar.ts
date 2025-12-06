import type { CalendarDay, CalendarMonth, CalendarWeek, Holiday, CalendarOptions } from "@/lib/types";

import "@/lib/assets/fonts/inter-normal";
import "@/lib/assets/fonts/inter-bold";

import { jsPDF } from "jspdf";
import { get } from "svelte/store";
import { bloburi, calendarOptions } from "@/lib/stores";
import { generateCalendar, splitArray } from "@/lib/utils";
import { DocOrientation, DocSize, WEEKDAYS_NAMES } from "@/lib/enums";
import { fontSizeA3, fontSizeA4 } from "@/lib/consts";

const apiUrl = (year: number | string) => `https://date.nager.at/api/v3/PublicHolidays/${year}/es`;
const margin = 7;
const gap = 5;
const dayCols = 7;
const dayRows = 8;

const fontFamily = "inter";
const baseColor = "black";
const weekDaysColor = "gray";
const holidayColor = "red";
const outlineColor = "gray";
const outlineWidth = 0.1;


const fontSize = {
  title: fontSizeA4.title,
  weekDays: fontSizeA4.weekDays,
  base: fontSizeA4.base,
}

const pageSize = { width: 0, height: 0 };
const titleBox = { x: 0, y: 0, width: 0, height: 0 };
const calendarBox = { x: 0, y: 0, width: 0, height: 0 };
const monthGrid = { cols: 3, rows: 4, gapX: 0, gapY: 0 };
const monthBox = { width: 0, height: 0 };
const dayBox = { width: 0, height: 0 };

function setBase() {
  const options = get(calendarOptions);

  const doc = new jsPDF({
    unit: "mm",
    format: options.size,
    orientation: options.orientation,
    putOnlyUsedFonts: true,
    precision: 5
  });

  doc.setProperties({
    title: "Weprintpdf",
  });

  doc.setFont(fontFamily, "normal");

  pageSize.width = doc.internal.pageSize.getWidth();
  pageSize.height = doc.internal.pageSize.getHeight();

  return { doc, options };
}

function setFontSize(options: CalendarOptions) {
  if (options.size === DocSize.A4) {
    fontSize.title = fontSizeA4.title;
    fontSize.weekDays = options.multipage ? fontSizeA4.weekDaysMultipage : fontSizeA4.weekDays;
    fontSize.base = options.multipage ? fontSizeA4.baseMultipage : fontSizeA4.base;
  } else if (options.size === DocSize.A3) {
    fontSize.title = fontSizeA3.title;
    fontSize.weekDays = options.multipage ? fontSizeA3.weekDaysMultipage : fontSizeA3.weekDays;
    fontSize.base = options.multipage ? fontSizeA3.baseMultipage : fontSizeA3.base;
  }
}

async function setHolidays(year: number, options: CalendarOptions, months: CalendarMonth[]) {
  if (options.holidays) {
    try {
      const req = await fetch(apiUrl(year));
      if (!req.ok) throw new Error("Data not found");

      const holidays = await req.json();

      return months.map((month: CalendarMonth) => {
        month.weeks.map((week: CalendarWeek) => {
          week.map((day: CalendarDay | null) => {
            if (day) {
              const findHoliday = holidays.find((holiday: Holiday) => holiday.date === day.iso);

              if (findHoliday) {
                day.holiday = true;
                day.holidayName = findHoliday.localName;
              }
            }

            return day;
          });

          return week;
        });

        return month;
      });
    } catch (error) {
      console.log(error);
      calendarOptions.update((options) => ({ ...options, holidays: false, labelHolidays: false }));
      alert("No se han encontrado datos de fiestas");
    }
  }

  return months;
}

function setTitle(doc: jsPDF, title: string) {
  titleBox.x = 0;
  titleBox.y = 0;
  titleBox.width = pageSize.width;
  titleBox.height = 30;

  /* doc.rect(titleBox.x, titleBox.y, titleBox.width, titleBox.height); */

  doc.setFontSize(fontSize.title)
    .setTextColor(baseColor)
    .setFont(fontFamily, "bold");

  doc.text(title, pageSize.width / 2, titleBox.y + titleBox.height / 2, {
    baseline: "middle",
    align: "center"
  });
}

function setMonthsGrid(options: CalendarOptions) {
  if (options.orientation === DocOrientation.LANDSCAPE) {
    monthGrid.cols = 4;
    monthGrid.rows = 3;
  } else {
    monthGrid.cols = 3;
    monthGrid.rows = 4;
  }

  const gapsOnX = monthGrid.cols - 1;
  const gapsOnY = monthGrid.rows - 1;
  monthGrid.gapX = (gap * gapsOnX) / monthGrid.cols;
  monthGrid.gapY = (gap * gapsOnY) / monthGrid.rows;
}

function setCalendarBox() {
  calendarBox.x = margin;
  calendarBox.y = titleBox.height;
  calendarBox.width = pageSize.width - (margin * 2);
  calendarBox.height = pageSize.height - margin - titleBox.height;

  /* doc.rect(calendarBox.x, calendarBox.y, calendarBox.width, calendarBox.height); */
}

function setMonthBox(options: CalendarOptions) {
  if (options.multipage) {
    monthBox.width = calendarBox.width;
    monthBox.height = calendarBox.height;
  } else {
    monthBox.width = (calendarBox.width / monthGrid.cols) - monthGrid.gapX;
    monthBox.height = (calendarBox.height / monthGrid.rows) - monthGrid.gapY;
  }
}

function setDayBox() {
  dayBox.width = monthBox.width / dayCols;
  dayBox.height = monthBox.height / dayRows;
}

function setDays(doc: jsPDF, week: CalendarWeek, weekX: number, weekY: number, options: CalendarOptions) {
  week.forEach((day, dayInd) => {
    const dayX = weekX + dayBox.width * dayInd;
    const dayY = weekY;
    const dayCenterX = dayX + dayBox.width / 2;
    const dayCenterY = dayY + dayBox.height / 2;


    if (day && day.day) {
      if (options.dayBox) {
        doc.setDrawColor(outlineColor);
        doc.setLineWidth(outlineWidth);
        doc.rect(dayX, dayY, dayBox.width, dayBox.height, "D");
      }

      const isSunday = Object.values(WEEKDAYS_NAMES)[day.weekday] === WEEKDAYS_NAMES.SUNDAY;

      if (options.sundays && isSunday || options.holidays && day.holiday) {
        doc.setFontSize(fontSize.base)
          .setTextColor(holidayColor)
          .setFont(fontFamily, "bold");
      } else {
        doc.setFontSize(fontSize.base)
          .setTextColor(baseColor)
          .setFont(fontFamily, "normal");
      }

      doc.text(`${day.day}`, dayCenterX, dayCenterY, {
        baseline: "middle",
        align: "center"
      })
    }
  })
}

function setWeeks(doc: jsPDF, month: CalendarMonth, monthX: number, monthY: number, options: CalendarOptions) {
  month.weeks.forEach((week, weekInd) => {
    const weekX = monthX;
    const weekY = monthY + ((weekInd + 2) * dayBox.height);

    /* doc.setDrawColor("red");
    doc.rect(weekX, weekY, monthWidth, dayHeight); */

    setDays(doc, week, weekX, weekY, options);
  })
}

function setWeekDays(doc: jsPDF, monthX: number, monthY: number) {
  Object.values(WEEKDAYS_NAMES).forEach((weekday, weekdayInd) => {
    const weekdayX = monthX + dayBox.width * weekdayInd;
    const weekdayY = monthY + dayBox.height;
    const weekdayCenterX = weekdayX + dayBox.width / 2;
    const weekdayCenterY = weekdayY + dayBox.height / 2;

    /* doc.setDrawColor("green");
    doc.rect(weekdayX, weekdayY, dayWidth, dayHeight); */

    doc.setFontSize(fontSize.weekDays)
      .setTextColor(weekDaysColor)
      .setFont(fontFamily, "normal");

    doc.text(weekday.slice(0, 2), weekdayCenterX, weekdayCenterY, {
      baseline: "middle",
      align: "center"
    })
  });
}

function setMonths(doc: jsPDF, splittedMonths: CalendarMonth[][], options: CalendarOptions) {
  splittedMonths.forEach((chunk, chunkInd) => {
    chunk.forEach((month, monthInd) => {
      const monthX = calendarBox.x + (monthInd * monthBox.width) + (monthInd < 1 ? 0 : gap * monthInd);
      const monthY = calendarBox.y + (chunkInd * monthBox.height) + (chunkInd < 1 ? 0 : gap * chunkInd);
      const monthCenterX = monthX + monthBox.width / 2;
      const monthCenterY = monthY + dayBox.height / 2;

      if (options.monthBox) {
        doc.setDrawColor(outlineColor);
        doc.setLineWidth(outlineWidth);
        doc.rect(monthX, monthY, monthBox.width, monthBox.height, "D");
      }

      doc.setFontSize(fontSize.base)
        .setTextColor(baseColor)
        .setFont(fontFamily, "normal");

      doc.text(month.name, monthCenterX, monthCenterY, {
        baseline: "middle",
        align: "center"
      });


      setWeekDays(doc, monthX, monthY);
      setWeeks(doc, month, monthX, monthY, options);
    })
  })
}

function setOutput(doc: jsPDF) {
  const pdfOutput = doc.output("bloburi")
  bloburi.set(pdfOutput.toString());
}

export async function createAnual() {
  const { doc, options } = setBase();
  const year = Number(options.year);

  setFontSize(options);
  setTitle(doc, options.year);
  setCalendarBox();
  setMonthsGrid(options);
  setMonthBox(options);
  setDayBox();

  const calendar = generateCalendar(year);
  calendar.months = await setHolidays(year, options, calendar.months);
  const splittedMonths = splitArray(calendar.months, monthGrid.cols);

  setMonths(doc, splittedMonths, options);
  setOutput(doc);
}

export async function createAnualMultipage() {
  const { doc, options } = setBase();
  const year = Number(options.year);

  setFontSize(options);
  setCalendarBox();
  setMonthBox(options);
  setDayBox();

  const calendar = generateCalendar(year);
  calendar.months = await setHolidays(year, options, calendar.months);

  calendar.months.forEach((month, monthInd) => {
    if (monthInd > 0) doc.addPage();

    setTitle(doc, month.name);
    setWeekDays(doc, margin, titleBox.height + margin);
    setWeeks(doc, month, margin, titleBox.height + margin, options);
  })


  setOutput(doc);
}