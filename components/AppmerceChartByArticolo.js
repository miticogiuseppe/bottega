"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import moment from "moment";

// Utility Excel e grafico
import {
  loadSheet,
  parseDates,
  filterByRange,
  sumByKey,
  orderSheet,
} from "@/utils/excelUtils";

// ApexCharts
const Spkapexcharts = dynamic(
  () =>
    import("@/shared/@spk-reusable-components/reusable-plugins/spk-apexcharts"),
  { ssr: false }
);

export default function AppmerceChart({
  title = "TS Azienda",
  startDate,
  endDate,
}) {
  const [graphSeries, setGraphSeries] = useState([]);
  const [graphOptions, setGraphOptions] = useState({});

  useEffect(() => {
    (async () => {
      try {
        // Carica il file Excel
        const response = await fetch("/data/APPMERCE-000.xlsx");
        const blob = await response.blob();
        let jsonSheet = await loadSheet(blob, "APPMERCE-000_1");

        // Prepara i dati
        jsonSheet = parseDates(jsonSheet, ["Data ord"]);
        jsonSheet = orderSheet(jsonSheet, ["Data ord"], ["asc"]);

        // Filtra per intervallo date
        if (startDate && endDate) {
          jsonSheet = filterByRange(
            jsonSheet,
            "Data ord",
            moment(startDate),
            moment(endDate)
          );
        }

        // Somma quantità per Articolo
        let counters = sumByKey(jsonSheet, "Articolo", "Qta da ev");
        counters = counters.sort((a, b) => b.count - a.count);

        // Trasforma per ApexCharts
        const seriesData = [
          {
            name: "Quantità",
            data: counters.map((c) => ({ x: c.Articolo, y: Number(c.count) })),
          },
        ];

        const chartOptions = {
          chart: { type: "bar" },
          dataLabels: { enabled: true },
          xaxis: {},
        };

        setGraphSeries(seriesData);
        setGraphOptions(chartOptions);
      } catch (err) {
        console.error("Errore nel caricamento del grafico TS Azienda:", err);
      }
    })();
  }, [startDate, endDate]);

  if (graphSeries.length === 0) return <p>Caricamento dati in corso...</p>;

  return (
    <div className="custom-card">
      <div className="card-header justify-content-between">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        <Spkapexcharts
          chartOptions={graphOptions}
          chartSeries={graphSeries}
          //type={graphOptions.chart?.type || "bar"}
          type={graphOptions.chart.type}
          width="100%"
          height={350}
        />
      </div>
    </div>
  );
}
