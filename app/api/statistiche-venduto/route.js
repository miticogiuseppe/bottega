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

    // Aggregazione Agente → Clienti → Famiglie
    const grouped = {};
    const familiesSet = new Set();
    let globalVal = 0,
      globalAlmQ = 0,
      globalAccQ = 0;

    rawData.forEach((row) => {
      const agenteNome = row["Descrizione Agente"] || "NON ASSEGNATO";
      const clienteNome =
        row["Descrizione Cliente/Fornitore"] || "CLIENTE GENERICO";

      let famigliaRaw = (row["Descrizione Famiglia"] || "VARIE")
        .toUpperCase()
        .trim();
      let famiglia = famigliaRaw;
      if (
        famigliaRaw === "EFFETTO LEGNO ACCIAIO" ||
        famigliaRaw === "EFFETTO LEGNO/ACCIAIO"
      ) {
        famiglia = "EFF. LGN/ACC.";
      } else if (famigliaRaw.includes("INESISTENTE")) {
        famiglia = "VARIE";
      }

      const valore = parseFloat(row["Valore"]) || 0;
      const qta = parseFloat(row["Quantita'"]) || 0;

      familiesSet.add(famiglia);
      globalVal += valore;
      if (famigliaRaw.includes("ALLUMINIO")) globalAlmQ += qta;
      if (famigliaRaw.includes("ACCESSORI")) globalAccQ += qta;

      if (!grouped[agenteNome]) {
        grouped[agenteNome] = {
          nome: agenteNome,
          famiglie: {},
          totVal: 0,
          clienti: {},
        };
      }
      if (!grouped[agenteNome].clienti[clienteNome]) {
        grouped[agenteNome].clienti[clienteNome] = {
          nome: clienteNome,
          famiglie: {},
          totVal: 0,
        };
      }

      const updateEntry = (entry) => {
        if (!entry.famiglie[famiglia])
          entry.famiglie[famiglia] = { v: 0, q: 0 };
        entry.famiglie[famiglia].v += valore;
        entry.famiglie[famiglia].q += qta;
        entry.totVal += valore;
      };

      updateEntry(grouped[agenteNome]);
      updateEntry(grouped[agenteNome].clienti[clienteNome]);
    });

    return new Response(
      JSON.stringify({
        processedData: Object.values(grouped),
        allFamilies: Array.from(familiesSet).sort(),
        kpis: { globalVal, globalAlmQ, globalAccQ },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  });
}
