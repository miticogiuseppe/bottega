"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import moment from "moment";

// Importa le utility Excel e grafico (path relativi al tuo progetto)
import {
  loadSheet,
  sheetCount,
  parseDates,
  filterByWeek,
  orderSheet,
  filterSheet,
  filterByRange,
} from "@/utils/excelUtils";
import { createSeries, createOptions } from "@/utils/graphUtils";

// Importa ApexCharts dal tuo reusable-plugins
const Spkapexcharts = dynamic(
  () =>
    import("@/shared/@spk-reusable-components/reusable-plugins/spk-apexcharts"),
  { ssr: false }
);

export default function AppmerceChart({ title = "TS Azienda" }) {
  const [graphSeries, setGraphSeries] = useState([]);
  const [graphOptions, setGraphOptions] = useState({});

  useEffect(() => {
    (async () => {
      try {
        // Carica il file Excel Appmerce
        const response = await fetch("/data/APPMERCE-000.xlsx");
        const blob = await response.blob();

        let jsonSheet = await loadSheet(blob, "APPMERCE-000_1");

        // Prepara i dati
        jsonSheet = parseDates(jsonSheet, ["Data ord"]);
        jsonSheet = orderSheet(jsonSheet, ["Data ord"], ["asc"]);
        jsonSheet = filterByWeek(jsonSheet, "Data ord", moment(), 2);

        const counters = sheetCount(jsonSheet, ["Data ord"]);
        const series = createSeries(counters);
        const options = createOptions(
          counters,
          "Data ord",
          (d) => d.format("DD/MM/YYYY"),
          "bar"
        );

        setGraphSeries(series);
        setGraphOptions(options);
      } catch (err) {
        console.error("Errore nel caricamento del grafico Appmerce:", err);
      }
    })();
  }, []);

  return (
    <div className="custom-card">
      <div className="card-header justify-content-between">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {graphSeries.length > 0 && graphOptions?.chart?.type ? (
          <Spkapexcharts
            chartOptions={{
              chart: { type: "bar" },
              xaxis: { categories: ["Vetrataa", "Alluminio", "PVC"] },
            }}
            chartSeries={[
              {
                name: "Quantità",
                data: [120, 85, 60],
              },
            ]}
            type="bar"
            width={"100%"}
            height={315}
          />
        ) : (
          <p>Caricamento dati in corso...</p>
        )}
      </div>
    </div>
  );
}
