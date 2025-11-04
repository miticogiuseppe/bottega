"use client";
import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import dynamic from "next/dynamic";
import SpkDropdown from "../../shared/@spk-reusable-components/reusable-uielements/spk-dropdown";
import Dropdown from "react-bootstrap/Dropdown";
import dayjs from "dayjs";

const Spkapexcharts = dynamic(
  () =>
    import(
      "../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts"
    ),
  { ssr: false }
);

//Estrai categorie dinamiche dall'array filtrato
const estraiCategorie = (serie) => {
  const punti = serie[0]?.data || [];
  return punti.map((p) => p.x);
};

//Filtra i dati in base al periodo selezionato
const filtraSerie = (serie, periodo) => {
  const oggi = dayjs();
  const inizio = {
    settimana: oggi.subtract(7, "day"),
    mese: oggi.subtract(1, "month"),
    anno: oggi.subtract(1, "year"),
  }[periodo];

  return [
    {
      ...serie[0],
      data: serie[0].data.filter((p) => {
        const d = dayjs(p.date);
        return d.isAfter(inizio) && d.isBefore(oggi.add(1, "day"));
      }),
    },
  ];
};

const MacchinaDashboard = ({
  nome,
  fileStorico,
  appmerce,
  fileAppmerce,
  graficoTS,
  graficoMacchina,
}) => {
  const [periodoTS, setPeriodoTS] = useState("mese");
  const [periodoMacchina, setPeriodoMacchina] = useState("mese");

  const serieTSFiltrata = filtraSerie(graficoTS.series, periodoTS);
  const serieMacchinaFiltrata = filtraSerie(
    graficoMacchina.series,
    periodoMacchina
  );

  return (
    <>
      <Row className="mb-4 align-items-stretch">
        <Col xl={4} className="d-flex">
          <Card className="custom-card w-100 h-100">
            <Card.Header>
              <Card.Title>Storico</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>
                <a
                  href={fileStorico}
                  download
                  className="btn btn-primary btn-sm me-2"
                >
                  Scarica STORICO
                </a>
                <a
                  href={fileAppmerce}
                  download
                  className="btn btn-secondary btn-sm"
                >
                  Scarica APPMERCE
                </a>
              </p>
              <ul className="list-unstyled">
                <li>
                  <strong>Ordini ricevuti:</strong> {appmerce.ordini}
                </li>
                <li>
                  <strong>Imballaggi previsti:</strong> {appmerce.imballaggi}
                </li>
                <li>
                  <strong>Ultima consegna:</strong> {appmerce.dataConsegna}
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="custom-card h-100">
            <Card.Header className="justify-content-between">
              <Card.Title>TS Azienda</Card.Title>
              <SpkDropdown
                toggleas="a"
                Customtoggleclass="btn btn-sm btn-light text-muted"
                Toggletext="Periodo"
              >
                <Dropdown.Item onClick={() => setPeriodoTS("settimana")}>
                  Questa settimana
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPeriodoTS("mese")}>
                  Ultimo mese
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPeriodoTS("anno")}>
                  Anno corrente
                </Dropdown.Item>
              </SpkDropdown>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-2">
                Visualizzazione: {periodoTS} ({serieTSFiltrata[0].data.length}{" "}
                dati)
              </p>
              <Spkapexcharts
                chartOptions={{
                  ...graficoTS.options,
                  xaxis: {
                    ...graficoTS.options.xaxis,
                    categories: estraiCategorie(serieTSFiltrata),
                  },
                }}
                chartSeries={serieTSFiltrata}
                type={graficoTS.options.chart.type}
                width="100%"
                height={315}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={8}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>Produzione {nome}</Card.Title>
              <SpkDropdown
                toggleas="a"
                Customtoggleclass="btn btn-sm btn-light text-muted"
                Toggletext="Periodo"
              >
                <Dropdown.Item onClick={() => setPeriodoMacchina("settimana")}>
                  Questa settimana
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPeriodoMacchina("mese")}>
                  Ultimo mese
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPeriodoMacchina("anno")}>
                  Anno corrente
                </Dropdown.Item>
              </SpkDropdown>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-2">
                Visualizzazione: {periodoMacchina} (
                {serieMacchinaFiltrata[0].data.length} dati)
              </p>
              <Spkapexcharts
                chartOptions={{
                  ...graficoMacchina.options,
                  xaxis: {
                    ...graficoMacchina.options.xaxis,
                    categories: estraiCategorie(serieMacchinaFiltrata),
                  },
                }}
                chartSeries={serieMacchinaFiltrata}
                type={graficoMacchina.options.chart.type}
                width="100%"
                height={315}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default MacchinaDashboard;
