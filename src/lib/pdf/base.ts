import { jsPDF } from "jspdf";
import { bloburi, calendarOptions } from "@/lib/stores";
import { get } from "svelte/store";
import { generateCalendar } from "@/lib/utils";
import { DocOrientation, WEEKDAYS_NAMES } from "@/lib/enums";

export function createPDF() {
  const { year, size, orientation } = get(calendarOptions);
  const calendar = generateCalendar(+year);

  const doc = new jsPDF({
    unit: "mm",
    format: size,
    orientation: orientation,
    putOnlyUsedFonts: true,
  });

  doc.setProperties({
    title: "Weprintpdf",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const outerMargin = 10;
  const innerMargin = 5;

  const monthCols = orientation === DocOrientation.PORTRAIT ? 3 : 4;
  const monthRows = orientation === DocOrientation.PORTRAIT ? 4 : 3;
  const monthWidth = (pageWidth - (outerMargin * 2)) / monthCols;
  const monthHeight = (pageHeight - (outerMargin * 2)) / monthRows;

  const dayCols = 7;
  const dayRows = 8;
  const dayWidth = monthWidth / dayCols;
  const dayHeight = monthHeight / dayRows;

  calendar.months.forEach((month, monthInd) => {
    if (monthInd < monthCols) {
      for (let monthRow = 0; monthRow < monthRows; monthRow++) {
        const monthX = outerMargin + (monthInd * monthWidth);
        const monthY = outerMargin + (monthRow * monthHeight);

        doc.setDrawColor("black");
        doc.rect(monthX, monthY, monthWidth, monthHeight);
        doc.setFontSize(10);
        doc.text(month.name, monthX + innerMargin, monthY + innerMargin, {
          baseline: "top"
        });

        Object.values(WEEKDAYS_NAMES).forEach((weekday, weekdayInd) => {
          const weekdayX = monthX + dayWidth * weekdayInd;
          const weekdayY = monthY + dayHeight;

          doc.setDrawColor("green");
          doc.rect(weekdayX, weekdayY, dayWidth, dayHeight);
          doc.text(weekday.slice(0, 2), weekdayX, weekdayY + innerMargin, {
            baseline: "top"
          })
        });

        month.weeks.forEach((week, weekInd) => {
          const weekX = monthX;
          const weekY = monthY + ((weekInd + 2) * dayHeight);

          doc.setDrawColor("red");
          doc.rect(weekX, weekY, monthWidth, dayHeight);

          week.forEach((day, dayInd) => {
            const dayX = weekX + dayWidth * dayInd;
            const dayY = weekY;

            if (day?.day) {
              doc.setDrawColor("blue");
              doc.rect(dayX, dayY, dayWidth, dayHeight);
              doc.text(`${day.day}`, dayX, dayY + innerMargin, {
                baseline: "top"
              })
            } else doc.setDrawColor("white");
          })
        })
      }
    }
  });

  const pdfOutput = doc.output("bloburi")
  bloburi.set(pdfOutput.toString());
}