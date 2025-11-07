"use client";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Seo from "../../../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../../../shared/layouts-components/page-header/pageheader";
import Spkcardscomponent from "../../../../../../shared/@spk-reusable-components/reusable-dashboards/spk-cards";
import { Cardsdata } from "../../../../../../shared/data/dashboard/salesdata";

import MacchinaDashboard from "@/app/components/MacchinaDashboard";
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
      xaxis: {}, // ← le categorie verranno generate dinamicamente
    },
    series: [
      {
        name: "Quantità",
        data: [
          { x: "Vetrate", y: 120, date: "2025-10-01" },
          { x: "Alluminio", y: 85, date: "2025-10-15" },
          { x: "PVC", y: 60, date: "2025-10-27" },
          { x: "Legno", y: 40, date: "2025-11-03" },
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
      {/* SEO + Header */}
      <Seo title="Macchina - Imballatrice" />
      <Pageheader
        title="Macchine"
        currentpage="Imballatrice"
        activepage="Imballatrice"
        showActions={false}
      />

      {/* Contenuto */}
      <Row>
        <Col xxl={12}>
          <MacchinaDashboard {...imballatricetest} />
        </Col>
      </Row>
    </Fragment>
  );
}
