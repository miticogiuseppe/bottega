import fs from "fs";
import path from "path";
import { getTokenData } from "@/utils/tokenData";
import { check } from "@/utils/api";

const mappingPath = path.join(process.cwd(), "data", "mappatura_agenti.json");
const agentMapping = fs.existsSync(mappingPath)
  ? JSON.parse(fs.readFileSync(mappingPath, "utf8"))
  : {};

export async function GET(req) {
  return await check(req, async () => {
    const token = await getTokenData();
    const { tenant, role, codice_agente, codice_cliente } = token;

    if (!tenant)
      return new Response(JSON.stringify({ error: "Missing tenant" }), {
        status: 400,
      });

    const jsonFile = path.join(
      process.env.DRIVE_PATH,
      "Copral",
      "4.0",
      "STAVEN-001.json",
    );
    if (!fs.existsSync(jsonFile))
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
      });

    let rawData = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

    // Filtro per ruolo
    if (role === "AGENTE" && codice_agente) {
      const normalize = (val) => String(val).replace(/\s+/g, "").toLowerCase();
      const nomeAgente = agentMapping[String(codice_agente)] || null;
      rawData = rawData.filter((row) => {
        const v = row["Descrizione Agente"] || row["Agente"] || "";
        return (
          normalize(v) === normalize(codice_agente) ||
          (nomeAgente && normalize(v) === normalize(nomeAgente))
        );
      });
    } else if (role === "CLIENTE" && codice_cliente) {
      rawData = rawData.filter(
        (row) =>
          String(row["Cliente/Fornitore"] || "")
            .trim()
            .toLowerCase() === String(codice_cliente).trim().toLowerCase(),
      );
    }
    // DIREZIONE → nessun filtro, vede tutto

    return new Response(JSON.stringify({ data: rawData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
}
