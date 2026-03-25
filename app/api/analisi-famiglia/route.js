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

    // Legge il JSON grezzo
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

    const rawData = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

    // Filtro per ruolo (stessa logica di fetch-excel-json)
    let filtered = rawData;
    if (role === "AGENTE" && codice_agente) {
      const normalize = (val) => String(val).replace(/\s+/g, "").toLowerCase();
      const nomeAgente = agentMapping[String(codice_agente)] || null;
      filtered = rawData.filter((row) => {
        const v = row["Descrizione Agente"] || row["Agente"] || "";
        return (
          normalize(v) === normalize(codice_agente) ||
          (nomeAgente && normalize(v) === normalize(nomeAgente))
        );
      });
    } else if (role === "CLIENTE" && codice_cliente) {
      filtered = rawData.filter(
        (row) =>
          String(
            row["Cliente/Fornitore"] ||
              row["Descrizione Cliente/Fornitore"] ||
              "",
          )
            .trim()
            .toLowerCase() === String(codice_cliente).trim().toLowerCase(),
      );
    }

    // Aggregazione lato server
    const tree = {};
    const agentsSet = new Set();
    const agentTotals = {};
    let globalVal = 0,
      globalAlmQ = 0,
      globalAccQ = 0;

    filtered.forEach((row) => {
      const agente = row["Descrizione Agente"] || "NON ASSEGNATO";
      const macro = (row["Descrizione Famiglia"] || "VARIE")
        .toUpperCase()
        .trim();
      const sotto = (row["Descrizione Gruppo"] || "ALTRO").toUpperCase().trim();
      const valore = parseFloat(row["Valore"]) || 0;
      const qta = parseFloat(row["Quantita'"]) || 0;

      agentsSet.add(agente);
      globalVal += valore;
      if (macro.includes("ALLUMINIO")) globalAlmQ += qta;
      if (macro.includes("ACCESSORI")) globalAccQ += qta;

      if (!tree[macro])
        tree[macro] = { nome: macro, sotto: {}, agenti: {}, totV: 0 };
      if (!tree[macro].agenti[agente])
        tree[macro].agenti[agente] = { v: 0, q: 0 };
      tree[macro].agenti[agente].v += valore;
      tree[macro].agenti[agente].q += qta;
      tree[macro].totV += valore;

      if (!tree[macro].sotto[sotto])
        tree[macro].sotto[sotto] = { nome: sotto, agenti: {}, totV: 0 };
      if (!tree[macro].sotto[sotto].agenti[agente])
        tree[macro].sotto[sotto].agenti[agente] = { v: 0, q: 0 };
      tree[macro].sotto[sotto].agenti[agente].v += valore;
      tree[macro].sotto[sotto].agenti[agente].q += qta;
      tree[macro].sotto[sotto].totV += valore;

      if (!agentTotals[agente]) agentTotals[agente] = { v: 0, q: 0 };
      agentTotals[agente].v += valore;
      agentTotals[agente].q += qta;
    });

    return new Response(
      JSON.stringify({
        matrix: Object.values(tree).sort((a, b) =>
          a.nome.localeCompare(b.nome),
        ),
        allAgents: Array.from(agentsSet).sort(),
        kpis: { globalVal, globalAlmQ, globalAccQ },
        totalsByAgent: agentTotals,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  });
}
