import "@/lib/assets/fonts/inter-normal";
import "@/lib/assets/fonts/inter-bold";
import { jsPDF } from "jspdf";
import { get } from "svelte/store";
import { bloburi, calendarOptions } from "@/lib/stores";
import { generateCalendar, splitArray } from "@/lib/utils";
import { WEEKDAYS_NAMES } from "@/lib/enums";

const apiUrl = (year: number | string) => `https://date.nager.at/api/v3/PublicHolidays/${year}/es`;

fetch(apiUrl(2025)).then(res => res.json()).then(json => console.log(json));


export function createAnual() {
  const options = get(calendarOptions);
  const calendar = generateCalendar(+options.year);

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

  doc.setFont("inter", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 7;
  const gap = 5;

  const titleBox = {
    x: 0,
    y: 0,
    width: pageWidth,
    height: 30
  }

  /* doc.rect(titleBox.x, titleBox.y, titleBox.width, titleBox.height); */

  doc.setFontSize(28)
    .setTextColor("black")
    .setFont("inter", "bold");

  doc.text(`${options.year}`, pageWidth / 2, titleBox.y + titleBox.height / 2, {
    baseline: "middle",
    align: "center"
  });

  const calendarBox = {
    x: margin,
    y: titleBox.height,
    width: pageWidth - (margin * 2),
    height: pageHeight - margin - titleBox.height
  }

  /* doc.rect(calendarBox.x, calendarBox.y, calendarBox.width, calendarBox.height); */

  const monthCols = +options.grid.split(",")[0];
  const monthRows = +options.grid.split(",")[1];
  const gapsOnX = monthCols - 1;
  const gapsOnY = monthRows - 1;
  const gapX = (gap * gapsOnX) / monthCols;
  const gapY = (gap * gapsOnY) / monthRows;

  const monthWidth = (calendarBox.width / monthCols) - gapX;
  const monthHeight = (calendarBox.height / monthRows) - gapY;

  const dayCols = 7;
  const dayRows = 8;
  const dayWidth = monthWidth / dayCols;
  const dayHeight = monthHeight / dayRows;

  const splittedMonths = splitArray(calendar.months, monthCols);

  splittedMonths.forEach((chunk, chunkInd) => {
    chunk.forEach((month, monthInd) => {
      const monthX = calendarBox.x + (monthInd * monthWidth) + (monthInd < 1 ? 0 : gap * monthInd);
      const monthY = calendarBox.y + (chunkInd * monthHeight) + (chunkInd < 1 ? 0 : gap * chunkInd);
      const monthCenterX = monthX + monthWidth / 2;
      const monthCenterY = monthY + dayHeight / 2;

      /* doc.setDrawColor("black");
      doc.rect(monthX, monthY, monthWidth, monthHeight); */

      doc.setFontSize(12)
        .setTextColor("black")
        .setFont("helvetica", "normal");

      doc.text(month.name, monthCenterX, monthCenterY, {
        baseline: "middle",
        align: "center"
      });

      Object.values(WEEKDAYS_NAMES).forEach((weekday, weekdayInd) => {
        const weekdayX = monthX + dayWidth * weekdayInd;
        const weekdayY = monthY + dayHeight;
        const weekdayCenterX = weekdayX + dayWidth / 2;
        const weekdayCenterY = weekdayY + dayHeight / 2;

        /* doc.setDrawColor("green");
        doc.rect(weekdayX, weekdayY, dayWidth, dayHeight); */

        doc.setFontSize(6)
          .setTextColor("gray")
          .setFont("helvetica", "normal");

        doc.text(weekday.slice(0, 2), weekdayCenterX, weekdayCenterY, {
          baseline: "middle",
          align: "center"
        })
      });

      month.weeks.forEach((week, weekInd) => {
        const weekX = monthX;
        const weekY = monthY + ((weekInd + 2) * dayHeight);

        /* doc.setDrawColor("red");
        doc.rect(weekX, weekY, monthWidth, dayHeight); */

        week.forEach((day, dayInd) => {
          const dayX = weekX + dayWidth * dayInd;
          const dayY = weekY;
          const dayCenterX = dayX + dayWidth / 2;
          const dayCenterY = dayY + dayHeight / 2;


          if (day && day.day) {

            if (options.dayBox) {
              doc.setDrawColor("#eee");
              doc.rect(dayX, dayY, dayWidth, dayHeight, "D");
            }

            const isSunday = Object.values(WEEKDAYS_NAMES)[day.weekday] === WEEKDAYS_NAMES.SUNDAY;
            const fontSize = options.textSize === "s" ? 8 : options.textSize === "m" ? 12 : 16;

            if (options.sundays && isSunday) {
              doc.setFontSize(fontSize)
                .setTextColor("red")
                .setFont("helvetica", "bold");
            } else {
              doc.setFontSize(fontSize)
                .setTextColor("black")
                .setFont("helvetica", "normal");
            }

            doc.text(`${day.day}`, dayCenterX, dayCenterY, {
              baseline: "middle",
              align: "center"
            })
          }
        })
      })
    })
  })

  const pdfOutput = doc.output("bloburi")
  bloburi.set(pdfOutput.toString());
}

export function createAnualMultipage() {
  const options = get(calendarOptions);
  const calendar = generateCalendar(+options.year);

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

  doc.setFont("inter", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 7;

  calendar.months.forEach((month, monthInd) => {
    if (monthInd > 0) doc.addPage();

    const titleBox = {
      x: margin,
      y: margin,
      width: pageWidth - (margin * 2),
      height: 30
    }

    /* doc.rect(titleBox.x, titleBox.y, titleBox.width, titleBox.height); */

    doc.setFontSize(28)
      .setTextColor("black")
      .setFont("inter", "bold");

    doc.text(`${month.name} ${options.year}`, pageWidth / 2, margin + (titleBox.height / 2), {
      baseline: "middle",
      align: "center"
    })

    const monthBox = {
      x: margin,
      y: titleBox.height + margin,
      width: pageWidth - (margin * 2),
      height: pageHeight - titleBox.height - (margin * 2)
    }

    /* doc.rect(monthBox.x, monthBox.y, monthBox.width, monthBox.height); */

    const dayCols = 7;
    const dayRows = 6;
    const dayWidth = monthBox.width / dayCols;
    const dayHeight = monthBox.height / dayRows;

    Object.values(WEEKDAYS_NAMES).forEach((weekday, weekdayInd) => {
      const weekdayX = monthBox.x + dayWidth * weekdayInd;
      const weekdayY = monthBox.y;
      const weekdayCenterX = weekdayX + dayWidth / 2;
      const weekdayCenterY = weekdayY + dayHeight / 2;

      /* doc.setDrawColor("green");
      doc.rect(weekdayX, weekdayY, dayWidth, dayHeight); */

      doc.setFontSize(12)
        .setTextColor("gray")
        .setFont("helvetica", "normal");

      doc.text(weekday.slice(0, 2), weekdayCenterX, weekdayCenterY, {
        baseline: "middle",
        align: "center"
      })
    });

    month.weeks.forEach((week, weekInd) => {
      const weekX = monthBox.x;
      const weekY = monthBox.y + ((weekInd + 1) * dayHeight);

      week.forEach((day, dayInd) => {
        const dayX = weekX + dayWidth * dayInd;
        const dayY = weekY;
        const dayCenterX = dayX + dayWidth / 2;
        const dayCenterY = dayY + dayHeight / 2;


        if (day && day.day) {

          if (options.dayBox) {
            doc.setDrawColor("#eee");
            doc.rect(dayX, dayY, dayWidth, dayHeight, "D");
          }

          const isSunday = Object.values(WEEKDAYS_NAMES)[day.weekday] === WEEKDAYS_NAMES.SUNDAY;
          const fontSize = options.textSize === "s" ? 14 : options.textSize === "m" ? 18 : 22;

          if (options.sundays && isSunday) {
            doc.setFontSize(fontSize)
              .setTextColor("red")
              .setFont("helvetica", "bold");
          } else {
            doc.setFontSize(fontSize)
              .setTextColor("black")
              .setFont("helvetica", "normal");
          }

          doc.text(`${day.day}`, dayCenterX, dayCenterY, {
            baseline: "middle",
            align: "center"
          })
        }
      })
    })
  })


  /* calendar.forEach((month, monthInd) => {
    if (monthInd > 0) doc.addPage();

    month.weeks.forEach((week, weekInd) => {
      const weekX = monthX;
      const weekY = monthY + ((weekInd + 2) * dayHeight);

      week.forEach((day, dayInd) => {
        const dayX = weekX + dayWidth * dayInd;
        const dayY = weekY;
        const dayCenterX = dayX + dayWidth / 2;
        const dayCenterY = dayY + dayHeight / 2;


        if (day && day.day) {

          if (options.dayBox) {
            doc.setDrawColor("#eee");
            doc.rect(dayX, dayY, dayWidth, dayHeight, "D");
          }

          const isSunday = Object.values(WEEKDAYS_NAMES)[day.weekday] === WEEKDAYS_NAMES.SUNDAY;
          const fontSize = options.textSize === "s" ? 8 : options.textSize === "m" ? 12 : 16;

          if (options.sundays && isSunday) {
            doc.setFontSize(fontSize)
              .setTextColor("red")
              .setFont("helvetica", "bold");
          } else {
            doc.setFontSize(fontSize)
              .setTextColor("black")
              .setFont("helvetica", "normal");
          }

          doc.text(`${day.day}`, dayCenterX, dayCenterY, {
            baseline: "middle",
            align: "center"
          })
        }
      })
    })
  }); */

  const pdfOutput = doc.output("bloburi")
  bloburi.set(pdfOutput.toString());
}