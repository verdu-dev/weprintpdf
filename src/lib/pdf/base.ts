import { jsPDF } from "jspdf";
import { bloburi, calendarOptions } from "@/lib/stores";
import { get } from "svelte/store";

export function createPDF() {
  const options = get(calendarOptions);

  const doc = new jsPDF({
    unit: "mm",
    format: options.size,
    orientation: options.orientation,
    putOnlyUsedFonts: true,
  });

  doc.setProperties({
    title: "Weprintpdf",
  });

  doc.text(options.year, 10, 10);
  const pdfOutput = doc.output("bloburi")

  bloburi.set(pdfOutput.toString());
}