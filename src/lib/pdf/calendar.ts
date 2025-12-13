import type { CalendarDay, CalendarMonth, CalendarWeek, Holiday, CalendarOptions } from "@/lib/types";

import "@/lib/assets/fonts/inter-normal";
import "@/lib/assets/fonts/inter-bold";

import { jsPDF } from "jspdf";
import { get } from "svelte/store";
import { availableHolidays, bloburi, calendarOptions } from "@/lib/stores";
import { generateCalendar, splitArray } from "@/lib/utils";
import { DocOrientation, WEEKDAYS_NAMES } from "@/lib/enums";
import { fontSize as fontConsts, spacing, fontStyle, apiHolidays } from "@/lib/consts";

let doc: jsPDF;
let options: CalendarOptions;
let dayRows = 8;
const dayCols = 7;

const fontSize = {
  cover: 0,
  title: 0,
  weekDays: 0,
  base: 0,
  holiday: 0
}

const pageSize = { width: 0, height: 0 };
const imageBox = { x: 0, y: 0, width: 0, height: 0 };
const titleBox = { x: 0, y: 0, width: 0, height: 0 };
const calendarBox = { x: 0, y: 0, width: 0, height: 0 };
const monthGrid = { cols: 3, rows: 4, gapX: 0, gapY: 0 };
const monthBox = { width: 0, height: 0 };
const dayBox = { width: 0, height: 0 };

function setBase() {
  options = get(calendarOptions);

  doc = new jsPDF({
    unit: "mm",
    format: options.size,
    orientation: options.orientation,
    putOnlyUsedFonts: true,
    precision: 5
  });

  doc.setProperties({
    title: "Weprintpdf",
  });

  doc.setFont(fontStyle.fontFamily, "normal");

  pageSize.width = doc.internal.pageSize.getWidth();
  pageSize.height = doc.internal.pageSize.getHeight();

  dayRows = options.monthly ? 7 : 8;
}

function setFontSize() {
  fontSize.cover = fontConsts[options.size].cover;
  fontSize.title = fontConsts[options.size].title;
  fontSize.holiday = fontConsts[options.size].holiday;

  if (options.monthly) {
    fontSize.weekDays = fontConsts[options.size].weekDaysmonthly;
    fontSize.base = fontConsts[options.size].basemonthly;
  } else {
    fontSize.weekDays = fontConsts[options.size].weekDays;
    fontSize.base = fontConsts[options.size].base;
  }
}

async function setHolidays(year: number, months: CalendarMonth[]) {
  try {
    const req = await fetch(apiHolidays(year));
    if (!req.ok) throw new Error("Data not found");

    const holidays = await req.json();
    availableHolidays.set(true);

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
  } catch (err) {
    console.log(err);
    availableHolidays.set(false);
    return months;
  }
}

function setCoverPage() {
  const coverImage = options.images[12];

  doc.setDrawColor("black");
  doc.rect(0, 0, pageSize.width, pageSize.height, "F");

  if (coverImage) {
    const coverBox = {
      x: 0,
      y: 0,
      width: pageSize.width,
      height: pageSize.height
    }

    const scaleX = coverBox.width / coverImage.img.width;
    const scaleY = coverBox.height / coverImage.img.height;
    const scale = Math.max(scaleX, scaleY);
    const scaledW = coverImage.img.width * scale;
    const scaledH = coverImage.img.height * scale;
    const offsetX = (coverBox.width - scaledW) / 2;
    const offsetY = (coverBox.height - scaledH) / 2;

    doc.saveGraphicsState();
    doc.rect(coverBox.x, coverBox.y, coverBox.width, coverBox.height, null);
    doc.clip();
    doc.discardPath();
    doc.addImage(coverImage.img, coverImage.format, offsetX, offsetY, scaledW, scaledH);
    doc.restoreGraphicsState();
  }

  doc.setFontSize(fontSize.cover);
  doc.setFont(fontStyle.fontFamily, "bold");
  doc.setTextColor("white");

  const textHeight = doc.getTextDimensions(`Calendario\n${options.year}`, {
    maxWidth: pageSize.width - (spacing[options.size].margin * 2),
  }).h;

  doc.text(`Calendario\n${options.year}`, spacing[options.size].margin, pageSize.height - spacing[options.size].margin - textHeight, {
    baseline: "top",
  });

  doc.addPage();
}

function setMonthImage(monthIndex: number) {
  const monthImage = options.images[monthIndex];

  if (!monthImage) {
    imageBox.width = 0;
    imageBox.height = 0;
    return;
  }

  imageBox.width = pageSize.width;

  if (options.orientation === DocOrientation.LANDSCAPE) imageBox.height = pageSize.height / 2.5;
  else imageBox.height = pageSize.width / 1.6;

  const scaleX = imageBox.width / monthImage.img.width;
  const scaleY = imageBox.height / monthImage.img.height;
  const scale = Math.max(scaleX, scaleY);
  const scaledW = monthImage.img.width * scale;
  const scaledH = monthImage.img.height * scale;
  const offsetX = (imageBox.width - scaledW) / 2;
  const offsetY = (imageBox.height - scaledH) / 2;

  doc.saveGraphicsState();
  doc.rect(imageBox.x, imageBox.y, imageBox.width, imageBox.height, null);
  doc.clip();
  doc.discardPath();
  doc.addImage(monthImage.img, monthImage.format, offsetX, offsetY, scaledW, scaledH);
  doc.restoreGraphicsState();

  /* debugBox(imageBox.x, imageBox.y, imageBox.width, imageBox.height); */
}

function setTitle(title: string) {
  titleBox.x = spacing[options.size].margin;
  titleBox.y = imageBox.height;
  titleBox.width = pageSize.width - (spacing[options.size].margin * 2);
  titleBox.height = spacing[options.size].titleHeight;

  const titleBoxCenterX = titleBox.width / 2 + titleBox.x;
  const titleBoxCenterY = titleBox.height / 2 + titleBox.y;

  doc.setFontSize(fontSize.title)
    .setTextColor(fontStyle.baseColor)
    .setFont(fontStyle.fontFamily, "bold");

  if (options.monthly) {
    doc.text(title, titleBoxCenterX, titleBox.y + titleBox.height, {
      baseline: "bottom",
      align: "center"
    });
  } else {
    doc.text(title, titleBoxCenterX, titleBoxCenterY, {
      baseline: "middle",
      align: "center"
    });
  }

  /* debugBox(titleBox.x, titleBox.y, titleBox.width, titleBox.height); */
}

function setCalendarBox() {
  calendarBox.x = spacing[options.size].margin;
  calendarBox.y = titleBox.height + imageBox.height + spacing[options.size].margin;
  calendarBox.width = pageSize.width - (spacing[options.size].margin * 2);
  calendarBox.height = pageSize.height - titleBox.height - imageBox.height - (spacing[options.size].margin * 2);

  /* debugBox(calendarBox.x, calendarBox.y, calendarBox.width, calendarBox.height); */
}

function setMonthsGrid() {
  if (options.orientation === DocOrientation.LANDSCAPE) {
    monthGrid.cols = 4;
    monthGrid.rows = 3;
  } else {
    monthGrid.cols = 3;
    monthGrid.rows = 4;
  }

  const gapsOnX = monthGrid.cols - 1;
  const gapsOnY = monthGrid.rows - 1;
  monthGrid.gapX = (spacing[options.size].gap * gapsOnX) / monthGrid.cols;
  monthGrid.gapY = (spacing[options.size].gap * gapsOnY) / monthGrid.rows;
}

function setMonthBox() {
  if (options.monthly) {
    monthBox.width = calendarBox.width;
    monthBox.height = calendarBox.height;
  } else {
    monthBox.width = (calendarBox.width / monthGrid.cols) - monthGrid.gapX;
    monthBox.height = (calendarBox.height / monthGrid.rows) - monthGrid.gapY;
  }
}

function setMonths(splittedMonths: CalendarMonth[][]) {
  splittedMonths.forEach((chunk, chunkInd) => {
    chunk.forEach((month, monthInd) => {
      const monthX = calendarBox.x + (monthInd * monthBox.width) + (monthInd < 1 ? 0 : spacing[options.size].gap * monthInd);
      const monthY = calendarBox.y + (chunkInd * monthBox.height) + (chunkInd < 1 ? 0 : spacing[options.size].gap * chunkInd);

      const monthCenterX = monthX + monthBox.width / 2;
      const monthCenterY = monthY + dayBox.height / 2;

      doc.setFontSize(fontSize.base)
        .setTextColor(fontStyle.baseColor)
        .setFont(fontStyle.fontFamily, "normal");

      doc.text(month.name, monthCenterX, monthCenterY, {
        baseline: "middle",
        align: "center"
      });


      setWeekDays(monthX, monthY);
      setWeeks(month, monthX, monthY);
    })
  })
}

function setWeekDays(monthX: number, monthY: number) {
  Object.values(WEEKDAYS_NAMES).forEach((weekday, weekdayInd) => {
    const weekdayX = monthX + dayBox.width * weekdayInd;
    const weekdayY = options.monthly ? monthY : monthY + dayBox.height;
    const weekdayCenterX = weekdayX + dayBox.width / 2;
    const weekdayCenterY = weekdayY + dayBox.height / 2;

    /* debugBox(weekdayX, weekdayY, dayBox.width, dayBox.height); */

    doc.setFontSize(fontSize.weekDays)
      .setTextColor(fontStyle.weekDaysColor)
      .setFont(fontStyle.fontFamily, "normal");

    if (options.monthly) {
      doc.text(weekday.slice(0, 2), weekdayCenterX, weekdayY + dayBox.height - spacing[options.size].margin, {
        baseline: "bottom",
        align: "center"
      })
    } else {
      doc.text(weekday.slice(0, 2), weekdayCenterX, weekdayCenterY, {
        baseline: "middle",
        align: "center"
      })
    }
  });
}

function setWeeks(month: CalendarMonth, monthX: number, monthY: number) {
  month.weeks.forEach((week, weekInd) => {
    const weekX = monthX;
    let weekY = monthY + ((weekInd + 2) * dayBox.height);

    if (options.monthly) {
      weekY = monthY + ((weekInd + 1) * dayBox.height);
    }

    /* debugBox(weekX, weekY, monthBox.width, dayBox.height); */

    setDays(week, weekX, weekY);
  })
}

function setDayBox() {
  if (options.monthly) {
    dayBox.width = calendarBox.width / dayCols;
    dayBox.height = calendarBox.height / dayRows;
  } else {
    dayBox.width = monthBox.width / dayCols;
    dayBox.height = monthBox.height / dayRows;
  }
}

function setDays(week: CalendarWeek, weekX: number, weekY: number) {
  week.forEach((day, dayInd) => {
    const dayX = weekX + dayBox.width * dayInd;
    const dayY = weekY;
    const dayCenterX = dayX + dayBox.width / 2;
    const dayCenterY = dayY + dayBox.height / 2;


    if (day && day.day) {

      if (options.boxDays) {
        doc.setDrawColor(fontStyle.outlineColor);
        doc.setLineWidth(fontStyle.outlineWidth);
        doc.rect(dayX, dayY, dayBox.width, dayBox.height, "D");
      }

      const isSunday = Object.values(WEEKDAYS_NAMES)[day.weekday] === WEEKDAYS_NAMES.SUNDAY;

      if (isSunday || day.holiday) {
        doc.setFontSize(fontSize.base)
          .setTextColor(fontStyle.holidayColor)
          .setFont(fontStyle.fontFamily, "bold");
      } else {
        doc.setFontSize(fontSize.base)
          .setTextColor(fontStyle.baseColor)
          .setFont(fontStyle.fontFamily, "normal");
      }

      if (options.monthly && options.labelHolidays) {
        doc.text(`${day.day}`, dayX + dayBox.width - spacing[options.size].innerMargin, dayY + spacing[options.size].innerMargin, {
          baseline: "top",
          align: "right"
        });

        if (day.holiday) {
          doc.setFontSize(fontSize.holiday)
            .setTextColor(fontStyle.weekDaysColor)
            .setFont(fontStyle.fontFamily, "normal");

          const textHeight = doc.getTextDimensions(`${day.holidayName}`, {
            maxWidth: dayBox.width - (spacing[options.size].innerMargin * 2),
          }).h;


          doc.text(`${day.holidayName}`, dayX + dayBox.width - spacing[options.size].innerMargin, dayY + dayBox.height - spacing[options.size].innerMargin - textHeight, {
            baseline: "top",
            align: "right",
            maxWidth: dayBox.width - (spacing[options.size].innerMargin * 2),
          });
        }
      } else {
        doc.text(`${day.day}`, dayCenterX, dayCenterY, {
          baseline: "middle",
          align: "center"
        });
      }
    }
  })
}

function setOutput() {
  const pdfOutput = doc.output("bloburi")
  bloburi.set(pdfOutput.toString());
}

export async function createAnual() {
  setBase();
  const year = Number(options.year);
  setFontSize();

  setTitle(options.year);
  setCalendarBox();
  setMonthsGrid();
  setMonthBox();
  setDayBox();

  const calendar = generateCalendar(year);
  calendar.months = await setHolidays(year, calendar.months);
  const splittedMonths = splitArray(calendar.months, monthGrid.cols);

  setMonths(splittedMonths);
  setOutput();
}

export async function createMonthly() {
  setBase();
  const year = Number(options.year);

  setFontSize();

  const calendar = generateCalendar(year);
  calendar.months = await setHolidays(year, calendar.months);

  if (options.cover) setCoverPage();

  if (options.oneMonth !== undefined) {
    const month = calendar.months[options.oneMonth];

    setMonthImage(options.oneMonth);
    setTitle(month.name);
    setCalendarBox();
    setMonthBox();
    setDayBox();

    setWeekDays(spacing[options.size].margin, calendarBox.y);
    setWeeks(month, spacing[options.size].margin, calendarBox.y);
  } else {
    calendar.months.forEach((month, monthInd) => {
      if (monthInd > 0) doc.addPage();

      setMonthImage(monthInd);
      setTitle(month.name);
      setCalendarBox();
      setMonthBox();
      setDayBox();

      setWeekDays(spacing[options.size].margin, calendarBox.y);
      setWeeks(month, spacing[options.size].margin, calendarBox.y);
    })
  }

  setOutput();
}