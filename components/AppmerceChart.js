"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import moment from "moment";

import {
  loadSheet,
  sumByKey,
  parseDates,
  filterByRange,
  orderSheet,
} from "@/utils/excelUtils";
import { createOptions } from "@/utils/graphUtils";

const Spkapexcharts = dynamic(
  () =>
    import("@/shared/@spk-reusable-components/reusable-plugins/spk-apexcharts"),
  { ssr: false }
);

export default function AppmerceChartByDate({
  title = "TS Azienda",
  startDate, // oggetto moment o stringa "YYYY-MM-DD"
  endDate, // oggetto moment o stringa "YYYY-MM-DD"
}) {
  const [graphSeries, setGraphSeries] = useState([]);
  const [graphOptions, setGraphOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const response = await fetch("/data/APPMERCE-000.xlsx");
        const blob = await response.blob();
        let jsonSheet = await loadSheet(blob, "APPMERCE-000_1");

        // Parse date e ordina
        jsonSheet = parseDates(jsonSheet, ["Data ord"]);
        jsonSheet = orderSheet(jsonSheet, ["Data ord"], ["asc"]);

        // Filtra per range di date se definito
        if (startDate && endDate) {
          jsonSheet = filterByRange(
            jsonSheet,
            "Data ord",
            moment(startDate),
            moment(endDate)
          );
        }

        // Somma quantità per articolo
        let counters = sumByKey(jsonSheet, "Articolo", "Qta da ev");
        counters = counters.sort((a, b) => b.count - a.count);

        // Trasforma in formato ApexCharts {x, y}
        const seriesData = [
          {
            name: "Quantità",
            data: counters.map((c) => ({
              x: c.Articolo,
              y: Number(c.count),
            })),
          },
        ];

        // Opzioni grafico
        const chartOptions = createOptions(counters, "Articolo", null, "bar");

        setGraphSeries(seriesData);
        setGraphOptions(chartOptions);
      } catch (err) {
        console.error("Errore nel caricamento del grafico Appmerce:", err);
        setGraphSeries([]);
        setGraphOptions({});
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]); // Ricarica ogni volta che cambia il range

  return (
    <div className="custom-card">
      <div className="card-header justify-content-between">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <p>Caricamento dati in corso...</p>
        ) : graphSeries.length > 0 && graphOptions.chart.type ? (
          <Spkapexcharts
            chartOptions={graphOptions}
            chartSeries={graphSeries}
            type={graphOptions.chart.type}
            width={"100%"}
            height={315}
          />
        ) : (
          <p>Nessun dato disponibile per il range selezionato.</p>
        )}
      </div>
    </div>
  );
}
