import { jsPDF } from "jspdf";
import { get } from "svelte/store";
import { bloburi, calendarOptions } from "@/lib/stores";
import { generateCalendar, splitArray } from "@/lib/utils";
import { DocOrientation, WEEKDAYS_NAMES } from "@/lib/enums";

export function createPDF() {
  const { year, size, orientation, sundays, bgColor, dayBox } = get(calendarOptions);
  const calendar = generateCalendar(+year);

  const doc = new jsPDF({
    unit: "mm",
    format: size,
    orientation: orientation,
    putOnlyUsedFonts: true,
    precision: 5
  });

  doc.setProperties({
    title: "Weprintpdf",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 7;
  const gap = 7;

  const monthCols = orientation === DocOrientation.PORTRAIT ? 3 : 4;
  const monthRows = orientation === DocOrientation.PORTRAIT ? 4 : 3;
  const gapsOnX = monthCols - 1;
  const gapsOnY = monthRows - 1;
  const gapX = (gap * gapsOnX) / monthCols;
  const gapY = (gap * gapsOnY) / monthRows;

  const monthWidth = ((pageWidth - (margin * 2)) / monthCols) - gapX;
  const monthHeight = ((pageHeight - (margin * 2)) / monthRows) - gapY;

  const dayCols = 7;
  const dayRows = 8;
  const dayWidth = monthWidth / dayCols;
  const dayHeight = monthHeight / dayRows;

  const splittedMonths = splitArray(calendar.months, monthCols);

  doc.setFillColor(bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  splittedMonths.forEach((chunk, chunkInd) => {
    chunk.forEach((month, monthInd) => {
      const monthX = margin + (monthInd * monthWidth) + (monthInd < 1 ? 0 : gap * monthInd);
      const monthY = margin + (chunkInd * monthHeight) + (chunkInd < 1 ? 0 : gap * chunkInd);
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

            if (dayBox) {
              doc.setDrawColor("black");
              doc.setLineWidth(0.01);
              doc.rect(dayX, dayY, dayWidth, dayHeight, "D");
            }

            const isSunday = Object.values(WEEKDAYS_NAMES)[day.weekday] === WEEKDAYS_NAMES.SUNDAY;

            if (sundays && isSunday) {
              doc.setFontSize(8)
                .setTextColor("red")
                .setFont("helvetica", "bold");
            } else {
              doc.setFontSize(8)
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