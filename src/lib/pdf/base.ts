import { jsPDF } from "jspdf";

export function createPDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  doc.setProperties({
    title: "Weprintpdf",
  });

  doc.text("Hello world!", 10, 10);
  const pdfOutput = doc.output("bloburi")

  return pdfOutput.toString();
}