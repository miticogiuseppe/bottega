"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import { loadSheet, filterByRange, sumByKey } from "@/shared/utils/excelUtils";
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
      let jsonSheet = await loadSheet(file, "APPMERCE-000_1");

      // Filtra per intervallo di date
      jsonSheet = filterByRange(
        jsonSheet,
        "Data ord",
        moment(startDate),
        moment(endDate)
      );

      // Somma quantità per articolo
      let counters = sumByKey(jsonSheet, "Articolo", "Qta da ev.");

      // Prendi i top 20 articoli
      counters = counters.sort((a, b) => b.count - a.count).slice(0, 20);

      const seriesData = createSeries(counters);
      const chartOptions = createOptions(counters, "Articolo", (d) => d, "bar");

      setSeries(seriesData);
      setOptions(chartOptions);
    }

    fetchData();
  }, [file, startDate, endDate]);

  return (
    <div className="w-full">
      {options && series && (
        <Chart options={options} series={series} type="bar" height={350} />
      )}
    </div>
  );
}
