"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Container, Row, Col, Card } from "react-bootstrap";
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
  graficoTS,
  graficoMacchina,
}) => {
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">{nome}</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <Card.Title>Storico</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>
                <a
                  href={fileStorico}
                  download
                  className="btn btn-primary btn-sm"
                >
                  Scarica STORICO.xlsx
                </a>
              </p>
              <ul className="list-unstyled">
                <li>Ordini ricevuti: {appmerce.ordini}</li>
                <li>Imballaggi previsti: {appmerce.imballaggi}</li>
                <li>Ultima consegna: {appmerce.dataConsegna}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="custom-card">
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
        <Col xl={12}>
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
    </Container>
  );
};

export default MacchinaDashboard;
