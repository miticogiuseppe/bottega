// import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });
import { pool } from "./utils/db.js";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import copyFrom from "pg-copy-streams";
import { Readable } from "stream";
import { log } from "console";
import async from "async";
import { doTransaction } from "./utils/db_utils.js";

const queue = async.queue(async (task) => {
  try {
    await task();
  } catch (err) {
    logger.error(err.stack || err);
  }
}, 1);

function readXlsx(filePath) {
  const workbook = xlsx.readFile(filePath, { dense: true, raw: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, { header: 1 });
}
function readCsv(filePath) {
  const workbook = xlsx.readFile(filePath, { raw: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, { header: 1 });
}
function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  if (Array.isArray(data)) return data;
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [data];
}
function readFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".xlsx":
    case ".xls":
      return readXlsx(filePath);
    case ".csv":
      return readCsv(filePath);
    case ".json":
      return readJson(filePath);
    case ".zip":
      console.log(`  ⏭ ZIP ignorato: ${filePath}`);
      return null;
    default:
      console.warn(`  ⚠ Formato non supportato: ${ext}`);
      return null;
  }
}
function convertRowsToCsv(rows) {
  let count = rows[0].length;
  const csv = rows
    .slice(1)
    .map((row) => {
      let ar = Array.from({ length: count }, (_, i) => row[i]);
      return ar
        .map((val) => {
          if (val === null || val === undefined) return "";
          if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
          return val;
        })
        .join(",");
    })
    .join("\n");
  return csv;
}
function buildTableName(tenant, id) {
  return (tenant + "__" + id).toLowerCase().replaceAll("-", "_");
}

async function doJob() {
  const dbPath = path.join(process.cwd(), "data", "filedb.json");
  const dbContent = fs.readFileSync(dbPath, "utf8");
  const db = JSON.parse(dbContent);

  for (let tenant in db) {
    for (let file of db[tenant]) {
      let ext = path.extname(file.path).toLowerCase();
      if (ext !== ".xlsx" && ext !== ".xls" && ext !== ".csv") continue;

      queue.push(async () => {
        console.log(tenant + "  " + file.id);

        const filePath = path.join(process.env.DRIVE_PATH, file.path);
        let content = readFile(filePath);
        let headRow = content[0];
        let csvContent = convertRowsToCsv(content);

        // inferisce tipi di dato
        let dataTypes = [];
        for (let i = 0; i < headRow.length; i++) {
          let isNumber = true;
          for (let j = 1; j < content.length; j++) {
            let val = content[j][i];
            if (val === null || val === undefined) continue;
            if (typeof val !== "number") {
              isNumber = false;
              break;
            }
          }
          dataTypes.push(isNumber);
        }

        let tableName = buildTableName(tenant, file.id);

        await doTransaction(pool, async (client) => {
          // ricrea la tabella
          await client.query(`DROP TABLE IF EXISTS "${tableName}"`, []);
          await client.query(
            `CREATE TABLE "${tableName}" (${headRow.map((h, i) => `"${h}" ${dataTypes[i] ? "numeric" : "character varying"}`).join(",")})`,
            [],
          );

          // inserisce righe
          const cols = headRow.map((h) => `"${h}"`).join(", ");
          const stream = client.query(
            copyFrom.from(`COPY "${tableName}" (${cols}) FROM STDIN CSV`),
          );
          const readable = Readable.from([csvContent]);
          await new Promise((resolve, reject) => {
            readable.pipe(stream);
            stream.on("finish", resolve);
            stream.on("error", reject);
          });

          // crea indici
          if (file.idx) {
            for (let i of file.idx) {
              await client.query(`CREATE INDEX ON "${tableName}" ("${i}")`);
            }
          }
        });
      });
    }
  }
}

cron.schedule("0 1 * * *", async () => await doJob());
