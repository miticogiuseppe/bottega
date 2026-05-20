import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { getTokenData } from "@/utils/tokenData";
import { getFileInfo, getFileStats } from "@/utils/fileTools";
import { check } from "@/utils/api";
import { buildTableName } from "@/utils/misc";
import { readTableInfo, readFromDb } from "@/utils/db_utils";
import { getPool } from "@/utils/db.js";
import { createCsvStream } from "@/utils/csvStream";

const pool = getPool();

const agenteCols = ["Agente", "Des. Agente", "Descrizione Agente"];
const clienteCols = [
  "Cliente/Fornitore",
  "Ragione sociale",
  "Descrizione Cliente/Fornitore",
];
const mappingPath = path.join(process.cwd(), "data", "mappatura_agenti.json");
const agentMapping = fs.existsSync(mappingPath)
  ? JSON.parse(fs.readFileSync(mappingPath, "utf8"))
  : {};

// Legge dal file (logica attuale invariata)
async function readFromRes(resource, sheetNameParam) {
  const filePath = path.join(process.env.DRIVE_PATH, resource.path);
  const jsonFile = path.join(
    process.env.DRIVE_PATH,
    path.parse(resource.path).dir,
    path.parse(resource.path).name + ".json",
  );

  let jsonSheet, fileDate;

  if (fs.existsSync(jsonFile)) {
    const data = fs.readFileSync(jsonFile, "utf-8");
    jsonSheet = JSON.parse(data);
    const fileInfo = await getFileInfo(jsonFile);
    fileDate = fileInfo.mtime;
  } else {
    console.log(`JSON not found: ${jsonFile}. Reading XLS.`);
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName =
      sheetNameParam && workbook.SheetNames.includes(sheetNameParam)
        ? sheetNameParam
        : workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    jsonSheet = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    const fileInfo = await getFileInfo(filePath);
    fileDate = fileInfo.mtime;
  }

  return { jsonSheet, fileDate };
}
async function getResDate(resource) {
  const filePath = path.join(process.env.DRIVE_PATH, resource.path);
  const jsonFile = path.join(
    process.env.DRIVE_PATH,
    path.parse(resource.path).dir,
    path.parse(resource.path).name + ".json",
  );

  const fileInfo = getFileStats(jsonFile) ?? getFileStats(filePath);
  return fileInfo.mtime;
}

// Applica i filtri agente/cliente
function applyFilters(jsonSheet, role, codice_agente, codice_cliente) {
  if (!jsonSheet || !Array.isArray(jsonSheet) || jsonSheet.length === 0)
    return jsonSheet;

  const columns = Object.keys(jsonSheet[0]);

  const agenteColumn = columns.find((col) => agenteCols.includes(col));
  const clienteColumn = columns.find((col) => clienteCols.includes(col));

  if (role === "AGENTE" && codice_agente && agenteColumn) {
    const normalize = (val) => String(val).replace(/\s+/g, "").toLowerCase();
    const nomeAgente = agentMapping[String(codice_agente)] || null;
    return jsonSheet.filter((row) => {
      const valore = row[agenteColumn];
      if (normalize(valore) === normalize(codice_agente)) return true;
      if (nomeAgente && normalize(valore) === normalize(nomeAgente))
        return true;
      return false;
    });
  }

  if (role === "CLIENTE" && codice_cliente && clienteColumn) {
    return jsonSheet.filter(
      (row) =>
        String(row[clienteColumn]).trim().toLowerCase() ===
        String(codice_cliente).trim().toLowerCase(),
    );
  }

  return jsonSheet;
}

export async function GET(req) {
  return await check(req, async () => {
    const token = await getTokenData();
    const { tenant, role, codice_agente, codice_cliente } = token;

    console.log("--- DEBUG FILTRO ---");
    console.log("Ruolo:", role);
    console.log("Agente:", codice_agente);
    console.log("Cliente:", codice_cliente);
    console.log("--------------------");

    if (!tenant)
      return new Response(JSON.stringify({ error: "Missing tenant" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const sheetNameParam = searchParams.get("sheet");

    if (!id)
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const dbPath = path.join(process.cwd(), "data", "filedb.json");
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const tenantResources = db[tenant];
    if (!tenantResources)
      return new Response(JSON.stringify({ error: "Tenant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const resource = tenantResources.find((r) => r.id === id);
    if (!resource)
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    let jsonSheet, fileDate, source;

    // 1. Prova dal DB
    const tableName = buildTableName(tenant, id);
    const tableColumns = await readTableInfo(pool, tableName);

    if (tableColumns) {
      console.log(`Fonte: DB (${tableName})`);

      let filters = [],
        params = [];
      let prog = 0;
      if (role === "AGENTE" && codice_agente)
        for (let col of agenteCols)
          if (tableColumns.includes(col)) {
            filters.push(`"${col}" = $${++prog}`);
            params.push(codice_agente);
            break;
          }
      if (role === "CLIENTE" && codice_cliente)
        for (let col of clienteCols)
          if (tableColumns.includes(col)) {
            filters.push(`"${col}" = $${++prog}`);
            params.push(codice_cliente);
            break;
          }
      let filter =
        filters.length > 0 ? "WHERE " + filters.join(" AND ") : undefined;

      console.log("eseguo query ", new Date());
      const dbRows = await readFromDb(pool, tableName, filter, params);
      console.log("query eseguita ", new Date());

      jsonSheet = dbRows;
      console.log("file date ", new Date());
      fileDate = await getResDate(resource);
      console.log("fine file date ", new Date());
      source = "db";
    } else {
      // 2. Fallback su file
      console.log(`⚠ Tabella "${tableName}" non trovata, fallback su file`);
      const fileResult = await readFromRes(resource, sheetNameParam);
      jsonSheet = fileResult.jsonSheet;
      fileDate = fileResult.fileDate;
      source = "file";

      // 3. Applica filtri
      jsonSheet = applyFilters(jsonSheet, role, codice_agente, codice_cliente);
    }

    console.log("creo stream", new Date());
    let stream = createCsvStream(jsonSheet, { lwt: fileDate, source });

    console.log("invio risposta ", new Date());
    return new Response(stream, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="export.csv"',
      },
    });

    // let json = JSON.stringify({ data: jsonSheet, lwt: fileDate, source });
    // return new Response(json, {
    //   status: 200,
    //   headers: { "Content-Type": "application/json" },
    // });
  });
}
