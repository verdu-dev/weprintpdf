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
const innerMargin = 3;
const titleHeight = 20;
// const weekDaysHeight = 10; TODO: make this work

const fontFamily = "inter";
const baseColor = "black";
const weekDaysColor = "gray";
const holidayColor = "red";
const outlineColor = "gray";
const outlineWidth = 0.1;

const dayCols = 7;
let dayRows = 8;

let doc: jsPDF;
let options: CalendarOptions;

const fontSize = {
  title: fontSizeA4.title,
  weekDays: fontSizeA4.weekDays,
  base: fontSizeA4.base,
  holiday: fontSizeA4.holiday
}

const pageSize = { width: 0, height: 0 };
const imagesBox = { x: 0, y: 0, width: 0, height: 0 };
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

  doc.setFont(fontFamily, "normal");

  pageSize.width = doc.internal.pageSize.getWidth();
  pageSize.height = doc.internal.pageSize.getHeight();

  dayRows = options.multipage ? 7 : 8;
}

function setFontSize() {
  if (options.size === DocSize.A4) {
    fontSize.title = fontSizeA4.title;
    fontSize.weekDays = options.multipage ? fontSizeA4.weekDaysMultipage : fontSizeA4.weekDays;
    fontSize.base = options.multipage ? fontSizeA4.baseMultipage : fontSizeA4.base;
    fontSize.holiday = fontSizeA4.holiday;
  } else if (options.size === DocSize.A3) {
    fontSize.title = fontSizeA3.title;
    fontSize.weekDays = options.multipage ? fontSizeA3.weekDaysMultipage : fontSizeA3.weekDays;
    fontSize.base = options.multipage ? fontSizeA3.baseMultipage : fontSizeA3.base;
    fontSize.holiday = fontSizeA3.holiday;
  }
}

async function setHolidays(year: number, months: CalendarMonth[]) {
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

function debugBox(x: number, y: number, width: number, height: number) {
  doc.setDrawColor(holidayColor);
  doc.setLineWidth(outlineWidth);
  doc.rect(x, y, width, height);
};

function setCoverPage() {
  const coverImage = options.images[12];
  if (!coverImage) return;

  const coverBoxX = 0;
  const coverBoxY = 0;
  const coverBoxWidth = pageSize.width;
  const coverBoxHeight = pageSize.height;
  const widthGreater = coverImage.aspectRatio < 1;
  const pageRatio = pageSize.width / pageSize.height;

  let coverX = 0;
  let coverY = 0;
  let coverWidth = 0;
  let coverHeight = 0;
  let coverCenterX = 0;
  let coverCenterY = 0;

  if (widthGreater) {
    coverCenterX = coverBoxWidth / 2 - (coverBoxHeight / coverImage.aspectRatio) / 2;
    coverX = pageRatio > coverImage.aspectRatio ? coverCenterX : 0;
    coverY = pageRatio > coverImage.aspectRatio ? 0 : coverCenterY;
    coverWidth = pageRatio > coverImage.aspectRatio ? coverBoxHeight / coverImage.aspectRatio : coverBoxWidth;
  } else {
    coverCenterY = coverBoxHeight / 2 - (coverBoxWidth * coverImage.aspectRatio) / 2;
    coverX = pageRatio > coverImage.aspectRatio ? 0 : coverCenterX;
    coverY = pageRatio > coverImage.aspectRatio ? coverCenterY : 0;
    coverHeight = pageRatio > coverImage.aspectRatio ? coverBoxWidth * coverImage.aspectRatio : coverBoxHeight;
  }

  doc.saveGraphicsState();
  doc.rect(coverBoxX, coverBoxY, coverBoxWidth, coverBoxHeight, null);
  doc.clip();
  doc.discardPath();
  doc.addImage(coverImage.img, coverImage.format, coverX, coverY, coverWidth, coverHeight);
  doc.restoreGraphicsState();

  doc.setFontSize(80);
  doc.setFont(fontFamily, "bold");
  doc.setTextColor("white");

  const textHeight = doc.getTextDimensions(`Calendario\n${options.year}`, {
    maxWidth: pageSize.width - (margin * 2),
  }).h;

  doc.text(`Calendario\n${options.year}`, margin, pageSize.height - margin - textHeight, {
    baseline: "top",
  });

  doc.addPage();
}

function setMonthImage(monthIndex: number) {
  const monthImage = options.images[monthIndex];

  if (!monthImage) {
    imagesBox.width = 0;
    imagesBox.height = 0;
    return;
  }

  imagesBox.width = pageSize.width;

  if (options.orientation === DocOrientation.LANDSCAPE) imagesBox.height = pageSize.height / 2.5;
  else imagesBox.height = pageSize.width / 1.6;

  const widthGreater = monthImage.aspectRatio < 1;
  let imageWidth = 0;
  let imageHeight = 0;
  let imageX = 0;
  let imageY = 0;
  let imageCenterX = 0;
  let imageCenterY = 0;

  if (widthGreater) {
    imageCenterX = pageSize.width / 2 - (imagesBox.height / monthImage.aspectRatio) / 2;
    imageX = imageCenterX;
    imageY = 0;
    imageWidth = imagesBox.height / monthImage.aspectRatio;
  } else {
    imageCenterY = imagesBox.height / 2 - (imagesBox.width * monthImage.aspectRatio) / 2;
    imageX = 0;
    imageY = imageCenterY;
    imageHeight = imagesBox.width * monthImage.aspectRatio;
  }

  doc.saveGraphicsState();
  doc.rect(imagesBox.x, imagesBox.y, imagesBox.width, imagesBox.height, null);
  doc.clip();
  doc.discardPath();
  doc.addImage(monthImage.img, monthImage.format, imageX, imageY, imageWidth, imageHeight);
  doc.restoreGraphicsState();

  /* debugBox(imagesBox.x, imagesBox.y, imagesBox.width, imagesBox.height); */
}

function setTitle(title: string) {
  titleBox.x = margin;
  titleBox.y = imagesBox.height;
  titleBox.width = pageSize.width - (margin * 2);
  titleBox.height = titleHeight;

  const titleBoxCenterX = titleBox.width / 2 + titleBox.x;
  const titleBoxCenterY = titleBox.height / 2 + titleBox.y;

  doc.setFontSize(fontSize.title)
    .setTextColor(baseColor)
    .setFont(fontFamily, "bold");

  if (options.multipage) {
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
  calendarBox.x = margin;
  calendarBox.y = titleBox.height + imagesBox.height + margin;
  calendarBox.width = pageSize.width - (margin * 2);
  calendarBox.height = pageSize.height - titleBox.height - imagesBox.height - (margin * 2);

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
  monthGrid.gapX = (gap * gapsOnX) / monthGrid.cols;
  monthGrid.gapY = (gap * gapsOnY) / monthGrid.rows;
}

function setMonthBox() {
  if (options.multipage) {
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
      const monthX = calendarBox.x + (monthInd * monthBox.width) + (monthInd < 1 ? 0 : gap * monthInd);
      const monthY = calendarBox.y + (chunkInd * monthBox.height) + (chunkInd < 1 ? 0 : gap * chunkInd);

      const monthCenterX = monthX + monthBox.width / 2;
      const monthCenterY = monthY + dayBox.height / 2;

      doc.setFontSize(fontSize.base)
        .setTextColor(baseColor)
        .setFont(fontFamily, "normal");

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
    const weekdayY = options.multipage ? monthY : monthY + dayBox.height;
    const weekdayCenterX = weekdayX + dayBox.width / 2;
    const weekdayCenterY = weekdayY + dayBox.height / 2;

    /* debugBox(weekdayX, weekdayY, dayBox.width, dayBox.height); */

    doc.setFontSize(fontSize.weekDays)
      .setTextColor(weekDaysColor)
      .setFont(fontFamily, "normal");

    if (options.multipage) {
      doc.text(weekday.slice(0, 2), weekdayCenterX, weekdayY + dayBox.height - margin, {
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

    if (options.multipage) {
      weekY = monthY + ((weekInd + 1) * dayBox.height);
    }

    /* debugBox(weekX, weekY, monthBox.width, dayBox.height); */

    setDays(week, weekX, weekY);
  })
}

function setDayBox() {
  if (options.multipage) {
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
      doc.setDrawColor(outlineColor);
      doc.setLineWidth(outlineWidth);
      doc.rect(dayX, dayY, dayBox.width, dayBox.height, "D");

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

      if (options.multipage && options.labelHolidays) {
        doc.text(`${day.day}`, dayX + dayBox.width - innerMargin, dayY + innerMargin, {
          baseline: "top",
          align: "right"
        });

        if (day.holiday) {
          doc.setFontSize(fontSize.holiday)
            .setTextColor(weekDaysColor)
            .setFont(fontFamily, "normal");

          const textHeight = doc.getTextDimensions(`${day.holidayName}`, {
            maxWidth: dayBox.width - (innerMargin * 2),
          }).h;


          doc.text(`${day.holidayName}`, dayX + dayBox.width - innerMargin, dayY + dayBox.height - innerMargin - textHeight, {
            baseline: "top",
            align: "right",
            maxWidth: dayBox.width - (innerMargin * 2),
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

export async function createAnualMultipage() {
  setBase();
  const year = Number(options.year);

  setFontSize();

  const calendar = generateCalendar(year);
  calendar.months = await setHolidays(year, calendar.months);

  if (options.cover) setCoverPage();

  calendar.months.forEach((month, monthInd) => {
    if (monthInd > 0) doc.addPage();

    setMonthImage(monthInd);
    setTitle(month.name);
    setCalendarBox();
    setMonthBox();
    setDayBox();

    setWeekDays(margin, calendarBox.y);
    setWeeks(month, margin, calendarBox.y);
  })


  setOutput();
}