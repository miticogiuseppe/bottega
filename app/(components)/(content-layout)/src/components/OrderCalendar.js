import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import OrderListModal from "./OrderListModal";
import "./OrderCalendar.css";
import Pageheader from "../../../../../shared/layouts-components/page-header/pageheader";
import { Card, Col, Row } from "react-bootstrap";
import React, { Fragment } from "react";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";

const OrderCalendar = ({ orders }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000).toISOString().split("T")[0];
  };

  const agenti = [
    ...new Set(orders.map((order) => order["Des. Agente"]).filter(Boolean)),
  ];

  const ordersFiltrati = orders.filter(
    (order) => selectedAgent === "" || order["Des. Agente"] === selectedAgent
  );

  const eventiPerData = {};

  ordersFiltrati.forEach((order) => {
    const data =
      typeof order["Data ord"] === "number"
        ? excelDateToJSDate(order["Data ord"])
        : order["Data ord"].replace(/\//g, "-");

    if (!eventiPerData[data]) eventiPerData[data] = [];
    eventiPerData[data].push(order);
  });

  const formattedEvents = Object.entries(eventiPerData).flatMap(
    ([data, eventi]) => {
      const visibili = eventi.slice(0, 2).map((order) => ({
        title: order.Articolo ?? "Sconosciuto",
        start: data,
        extendedProps: {
          cliente: order.Cli ?? "N/A",
          quantità: order["Qta da ev"] ?? "N/A",
          sezione: order.Sez ?? "N/A",
        },
      }));

      const nascosti = eventi.length - 2;

      const extra =
        nascosti > 0
          ? [
              {
                title: `+${nascosti} altri`,
                start: data,
                extendedProps: { isMoreLink: true },
                className: "more-link-event",
              },
            ]
          : [];

      return [...visibili, ...extra];
    }
  );

  const handleEventClick = (info) => {
    const clickedDate = info.event.startStr;

    const ordiniGiorno = ordersFiltrati.filter((order) => {
      const dataOrdine =
        typeof order["Data ord"] === "number"
          ? excelDateToJSDate(order["Data ord"])
          : order["Data ord"].replace(/\//g, "-");

      return dataOrdine === clickedDate;
    });

    setSelectedOrders(
      ordiniGiorno.map((order) => ({
        cliente: order.Cli ?? "N/A",
        quantità: order["Qta da ev"] ?? "N/A",
        sezione: order.Sez ?? "N/A",
        agente: order["Des. Agente"] ?? "N/A",
      }))
    );
  };

  return (
    <Fragment>
      <Seo title="Calendario APPMERCE di Copral" />
      <Pageheader
        title="Apps"
        currentpage="Calendario Ordini"
        activepage="Calendario Ordini APPMERCE di Copral"
      />

      <Row>
        <Col xl={12}>
          <Card className="custom-card overflow-hidden">
            <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="card-title mb-0">Calendario Ordini</div>

              <div>
                <label htmlFor="agenteSelect" className="form-label me-2 mb-0">
                  Agente:
                </label>
                <select
                  id="agenteSelect"
                  className="form-select form-select-sm d-inline-block w-auto"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="">Tutti</option>
                  {agenti.map((agente, idx) => (
                    <option key={idx} value={agente}>
                      {agente}
                    </option>
                  ))}
                </select>
              </div>
            </Card.Header>

            <Card.Body>
              <div id="calendar2" className="overflow-hidden">
                <FullCalendar
                  plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                  }}
                  initialView="dayGridMonth"
                  events={formattedEvents}
                  eventClick={handleEventClick}
                  eventOrder={(a, b) => {
                    if (a.extendedProps?.isMoreLink) return 1;
                    if (b.extendedProps?.isMoreLink) return -1;
                    return 0;
                  }}
                />
                <OrderListModal
                  orders={selectedOrders}
                  onClose={() => setSelectedOrders([])}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default OrderCalendar;
