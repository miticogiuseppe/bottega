"use client";
import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import MacchinaDashboard from "@/components/MacchinaDashboard";
import AppmerceChart from "@/components/AppmerceChart";
import AppmerceChartByArticolo from "@/components/AppmerceChartByArticolo";

const imballatricetest = {
  nome: "Imballatrice",
  fileStorico: "/data/STORICO_IMBALLATRICE.zip",
  fileAppmerce: "/data/APPMERCE-000.xlsx",
  appmerce: {
    ordini: 128,
    imballaggi: 2340,
    dataConsegna: "2025-10-27",
  },

  graficoTS: {
    options: {
      chart: { type: "bar" },
      xaxis: {},
    },

    series: [
      {
        name: "TS Azienda",
        data: [
          { x: "Vetrate", y: 120, date: "2025-10-01" },
          { x: "Alluminio", y: 85, date: "2025-10-15" },
          { x: "PVC", y: 60, date: "2025-10-27" },
          { x: "Legno", y: 40, date: "2025-11-04" },
        ],
      },
    ],
  },
  graficoMacchina: {
    options: {
      chart: { type: "bar" },
      xaxis: {},
    },
    series: [
      {
        name: "Produzione",
        data: [
          { x: "Default", y: 150, date: "2025-10-10" },
          { x: "Pergola", y: 90, date: "2025-10-25" },
          { x: "Tenda", y: 40, date: "2025-11-03" },
        ],
      },
    ],
  },
};

export default function PaginaImballatrice() {
  return (
    <Fragment>
      {/* SEO + intestazione */}
      <Seo title="Macchina - Imballatrice" />
      <Pageheader
        title="Macchine"
        currentpage="Imballatrice"
        activepage="Imballatrice"
        showActions={false}
      />

      {/* Contenuto principale */}
      <Row>
        <Col xxl={12}>
          <MacchinaDashboard {...imballatricetest} />
        </Col>
      </Row>

      {/* Grafico TS Azienda (Appmerce) */}
      <Row className="mt-4">
        <Col xl={6}>
          <AppmerceChart title="TS Azienda" />
        </Col>
        <Col xl={6}>
          <AppmerceChartByArticolo
            file={imballatricetest.fileAppmerce}
            startDate="2025-10-01"
            endDate="2025-10-31"
          />
        </Col>
      </Row>
    </Fragment>
  );
}
