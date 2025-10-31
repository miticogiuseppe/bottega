"use client";
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Seo from "../../../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../../../shared/layouts-components/page-header/pageheader";
import Spkcardscomponent from "../../../../../../shared/@spk-reusable-components/reusable-dashboards/spk-cards";
import { Cardsdata } from "../../../../../../shared/data/dashboard/salesdata";

import MacchinaDashboard from "@/app/components/MacchinaDashboard";

const imballatriceData = {
  nome: "Imballatrice",
  fileStorico: "/files/STORICO_IMBALLATRICE.xlsx",
  fileAppmerce: "/files/APPMERCE_IMBALLATRICE.xlsx",
  appmerce: {
    ordini: 128,
    imballaggi: 2340,
    dataConsegna: "2025-10-27",
  },
  graficoTS: {
    options: {
      chart: { type: "bar" },
      xaxis: { categories: ["Vetrate", "Alluminio", "PVC"] },
    },
    series: [
      {
        name: "Quantità",
        data: [120, 85, 60],
      },
    ],
  },
  graficoMacchina: {
    options: {
      chart: { type: "bar" },
      xaxis: { categories: ["Default", "Pergola"] },
    },
    series: [
      {
        name: "Produzione",
        data: [150, 90],
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
          <MacchinaDashboard {...imballatriceData} />
        </Col>
      </Row>
    </Fragment>
  );
}
