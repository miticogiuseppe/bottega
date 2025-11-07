"use client";
import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import Seo from "../../../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../../../shared/layouts-components/page-header/pageheader";
import MacchinaDashboard from "@/app/components/MacchinaDashboard";
// import AppmerceChart from "../../../../../../shared/components/AppmerceChart";

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
      xaxis: {
        categories: ["Alluminio", "PVC", "Legno", "Acciaio"],
      },
    },
    series: [
      {
        name: "TS Azienda",
        data: [
          { x: "Alluminio", y: 120, date: "2025-10-01" },
          { x: "PVC", y: 95, date: "2025-10-10" },
          { x: "Legno", y: 60, date: "2025-10-15" },
          { x: "Acciaio", y: 80, date: "2025-10-20" },
        ],
      },
    ],
  },
  graficoMacchina: {
    options: {
      chart: { type: "bar" },
      xaxis: {
        categories: ["Default", "Pergola", "Tenda"],
      },
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

      {/* 🔹 Grafico TS Azienda (Appmerce) */}
      {/* <Row className="mt-4">
        <Col xl={6}>
          <AppmerceChart title="TS Azienda" />
        </Col>
      </Row> */}
    </Fragment>
  );
}
