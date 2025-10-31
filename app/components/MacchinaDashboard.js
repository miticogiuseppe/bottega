"use client";
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import dynamic from "next/dynamic";
import SpkDropdown from "../../shared/@spk-reusable-components/reusable-uielements/spk-dropdown";
import Dropdown from "react-bootstrap/Dropdown";

const Spkapexcharts = dynamic(
  () =>
    import(
      "../../shared/@spk-reusable-components/reusable-plugins/spk-apexcharts"
    ),
  { ssr: false }
);

const MacchinaDashboard = ({
  nome,
  fileStorico,
  appmerce,
  fileAppmerce,
  graficoTS,
  graficoMacchina,
}) => {
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
                <Dropdown.Item href="#!">Questa settimana</Dropdown.Item>
                <Dropdown.Item href="#!">Ultimo mese</Dropdown.Item>
                <Dropdown.Item href="#!">Anno corrente</Dropdown.Item>
              </SpkDropdown>
            </Card.Header>
            <Card.Body>
              <Spkapexcharts
                chartOptions={graficoTS.options}
                chartSeries={graficoTS.series}
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
                <Dropdown.Item href="#!">Questa settimana</Dropdown.Item>
                <Dropdown.Item href="#!">Ultimo mese</Dropdown.Item>
                <Dropdown.Item href="#!">Anno corrente</Dropdown.Item>
              </SpkDropdown>
            </Card.Header>
            <Card.Body>
              <Spkapexcharts
                chartOptions={graficoMacchina.options}
                chartSeries={graficoMacchina.series}
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
