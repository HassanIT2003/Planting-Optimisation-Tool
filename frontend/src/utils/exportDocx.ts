import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

interface SpeciesRecommendation {
  name: string;
  matched: string;
  notMatched?: string;
  limitingFactor?: string;
  keyReasons?: string[];
  score: number;
}

export async function exportDocx(recommendations: SpeciesRecommendation[]) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Species Recommendation Report",
                bold: true,
                size: 32,
              }),
            ],
          }),
          ...recommendations.map(item => {
            const reasonsText = item.keyReasons
              ? item.keyReasons.join(", ")
              : "N/A";

            return new Paragraph({
              children: [
                new TextRun({
                  text: `\nSpecies: ${item.name}`,
                  bold: true,
                }),
                new TextRun({ text: `\nMatched: ${item.matched}` }),
                new TextRun({
                  text: `\nKey Reasons: ${reasonsText}`,
                }),
                new TextRun({ text: `\nScore: ${item.score}\n\n` }),
              ],
            });
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "recommendation_report.docx");
}
