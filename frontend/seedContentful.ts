// seedContentful.ts
import fs from "fs";
import csv from "csv-parser";
import contentful from "contentful-management";
import type { Environment } from "contentful-management";
import dotenv from "dotenv";

dotenv.config();

const { createClient } = contentful;

// --- CONFIGURATION ---
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "";
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN || "";
const ENVIRONMENT_ID = "master";

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error("❌ Error: Missing credentials. Please check your .env file.");
  process.exit(1);
}

// --- TYPES ---
interface SpeciesCsvRow {
  id: string;
  name: string;
  common_name: string;
  rainfall_mm_min: string;
  rainfall_mm_max: string;
  temperature_celsius_min: string;
  temperature_celsius_max: string;
  elevation_m_min: string;
  elevation_m_max: string;
  ph_min: string;
  ph_max: string;
  soil_textures: string;
  coastal: string;
  riparian: string;
  nitrogen_fixing: string;
  shade_tolerant: string;
  bank_stabilising: string;
  agroforestry_types: string;
}

const client = createClient({ accessToken: MANAGEMENT_TOKEN });

// --- TEXT GENERATOR ---
const generateRichText = (row: SpeciesCsvRow) => {
  const benefits: string[] = [];
  if (row.nitrogen_fixing === "TRUE") benefits.push("Nitrogen Fixing");
  if (row.bank_stabilising === "TRUE") benefits.push("Bank Stabilising");
  if (row.shade_tolerant === "TRUE") benefits.push("Shade Tolerant");
  if (row.coastal === "TRUE") benefits.push("Coastal Resilient");

  return {
    nodeType: "document",
    data: {},
    content: [
      {
        nodeType: "paragraph",
        data: {}, // <--- ADDED THIS (Required)
        content: [
          {
            nodeType: "text",
            value: `${row.common_name} (${row.name}) is a versatile species suited for ${row.agroforestry_types} systems. It is particularly well-adapted to ${row.soil_textures} soil types with a pH range of ${row.ph_min}–${row.ph_max}.`,
            marks: [],
            data: {},
          },
        ],
      },
      {
        nodeType: "heading-3",
        data: {}, // <--- ADDED THIS (Required)
        content: [
          {
            nodeType: "text",
            value: "Ecological Requirements",
            marks: [],
            data: {},
          },
        ],
      },
      {
        nodeType: "paragraph",
        data: {}, // <--- ADDED THIS (Required)
        content: [
          {
            nodeType: "text",
            value: `To thrive, this species requires an annual rainfall between ${row.rainfall_mm_min}mm and ${row.rainfall_mm_max}mm. It grows best in temperatures ranging from ${row.temperature_celsius_min}°C to ${row.temperature_celsius_max}°C and can be found at elevations from ${row.elevation_m_min}m up to ${row.elevation_m_max}m.`,
            marks: [],
            data: {},
          },
        ],
      },
      {
        nodeType: "heading-3",
        data: {}, // <--- ADDED THIS (Required)
        content: [
          { nodeType: "text", value: "Key Benefits", marks: [], data: {} },
        ],
      },
      {
        nodeType: "unordered-list",
        data: {}, // <--- ADDED THIS (Required)
        content: benefits.map(benefit => ({
          nodeType: "list-item",
          data: {}, // <--- ADDED THIS (Required)
          content: [
            {
              nodeType: "paragraph",
              data: {}, // <--- ADDED THIS (Required)
              content: [
                { nodeType: "text", value: benefit, marks: [], data: {} },
              ],
            },
          ],
        })),
      },
    ],
  };
};

const processRow = async (environment: Environment, row: SpeciesCsvRow) => {
  try {
    const existing = await environment.getEntries({
      content_type: "species",
      "fields.scientificName.en-US": row.name,
    });

    if (existing.total > 0) {
      console.log(`Skipping ${row.name} - already exists.`);
      return;
    }

    const entry = await environment.createEntry("species", {
      fields: {
        name: { "en-US": row.common_name },
        scientificName: { "en-US": row.name },
        description: { "en-US": generateRichText(row) },
        keywords: {
          "en-US": [
            row.name,
            row.common_name,
            ...row.agroforestry_types.split(", "),
            row.soil_textures,
          ],
        },
      },
    });

    await entry.publish();
    console.log(`✅ Published: ${row.common_name}`);
  } catch (error: any) {
    // Better error logging to see details
    console.error(`❌ Error processing ${row.name}:`, error.message);
    if (error.details) console.error(JSON.stringify(error.details, null, 2));
  }
};

const run = async () => {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    const rows: SpeciesCsvRow[] = [];

    fs.createReadStream("species.csv")
      .pipe(csv())
      .on("data", (data: SpeciesCsvRow) => rows.push(data))
      .on("end", async () => {
        console.log(`Found ${rows.length} species. Starting import...`);
        for (const row of rows) {
          await processRow(environment, row);
        }
        console.log("Import complete!");
      });
  } catch (err) {
    console.error("Script failed:", err);
  }
};

run();
