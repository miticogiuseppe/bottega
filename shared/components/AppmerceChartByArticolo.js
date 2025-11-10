"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import {
  loadSheetFromUrl,
  filterByRange,
  sumByKey,
  parseDates,
} from "@/shared/utils/excelUtils";
import { createSeries, createOptions } from "@/shared/utils/graphUtils";

const Chart = dynamic(
  () =>
    import("@/shared/@spk-reusable-components/reusable-plugins/spk-apexcharts"),
  {
    ssr: false,
  }
);

export default function AppmerceChartByArticolo({ file, startDate, endDate }) {
  const [options, setOptions] = useState(null);
  const [series, setSeries] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let jsonSheet = await loadSheetFromUrl(file, "APPMERCE-000_1");

        jsonSheet = parseDates(jsonSheet, ["Data ord"]);
        jsonSheet = filterByRange(
          jsonSheet,
          "Data ord",
          moment(startDate),
          moment(endDate)
        );

        let counters = sumByKey(jsonSheet, "Articolo", "Qta da ev.");
        counters = counters.sort((a, b) => b.count - a.count).slice(0, 20);

        const seriesData = createSeries(counters);
        const chartOptions = createOptions(
          counters,
          "Articolo",
          (d) => d,
          "bar"
        );

        setSeries(seriesData);
        setOptions(chartOptions);
      } catch (error) {
        console.error("Errore nel caricamento del grafico:", error);
        setOptions(null);
        setSeries(null);
      }
    }

    fetchData();
  }, [file, startDate, endDate]);

  if (
    !options ||
    !options.chart ||
    !options.chart.type ||
    !Array.isArray(series)
  ) {
    return <p>Grafico non disponibile o dati incompleti.</p>;
  }

  return (
    <div className="w-full">
      {options?.chart?.type && Array.isArray(series) ? (
        <Chart
          chartOptions={options}
          chartSeries={series}
          type={options.chart.type}
          height={350}
        />
      ) : (
        <p>Grafico non disponibile o dati incompleti.</p>
      )}
    </div>
  );
}
