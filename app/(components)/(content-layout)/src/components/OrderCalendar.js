import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import OrderListModal from "./OrderListModal";
import "./OrderCalendar.css";
import Pageheader from "../../../../../shared/layouts-components/page-header/pageheader";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import React, { Fragment } from "react";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";

const OrderCalendar = ({ orders }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Funzione per convertire le date di Excel in formato JavaScript
  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000).toISOString().split("T")[0]; // Ottiene YYYY-MM-DD
  };

  //Eventi presi per data
  const eventiPerData = {};

  orders.forEach((order) => {
    const data =
      typeof order["Data ord"] === "number"
        ? excelDateToJSDate(order["Data ord"])
        : order["Data ord"].replace(/\//g, "-");

    if (!eventiPerData[data]) eventiPerData[data] = [];
    eventiPerData[data].push(order);
  });

  // Raggruppa gli ordini per data, limitando a 2 eventi per data
  const groupedByDate = {};

  orders.forEach((order) => {
    const rawDate =
      typeof order["Data ord"] === "number"
        ? excelDateToJSDate(order["Data ord"])
        : order["Data ord"].replace(/\//g, "-");

    if (!groupedByDate[rawDate]) groupedByDate[rawDate] = [];

    if (groupedByDate[rawDate].length < 2) {
      groupedByDate[rawDate].push({
        title: order.Articolo ?? "Sconosciuto",
        start: rawDate,
        extendedProps: {
          cliente: order.Cli ?? "N/A",
          quantità: order["Qta da ev"] ?? "N/A",
          sezione: order.Sez ?? "N/A",
        },
      });
    }
  });

  // Trasforma gli eventi in un formato compatibile con FullCalendar
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

  // Gestisce il click sugli eventi
  const handleEventClick = (info) => {
    const isMoreLink = info.event.extendedProps.isMoreLink;
    const clickedDate = info.event.startStr;

    const ordiniGiorno = orders.filter((order) => {
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
      }))
    );
  };

  return (
    <Fragment>
      {/* <!-- Page Header --> */}
      <Seo title="Calendario APPMERCE di Copral" />
      <Pageheader
        title="Apps"
        currentpage="Calendario Ordini"
        activepage="Calendario Ordini APPMERCE di Copral"
      />
      {/* <!-- Page Header Close --> */}

      {/* <!-- Start::row-1 --> */}
      <Row>
        <Col xl={12} className="mb-0">
          <Card className="custom-card overflow-hidden">
            <Card.Header className="">
              <div className="card-title">Calendario Ordini</div>
            </Card.Header>
            <Card.Body className="">
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
      {/* <!--End::row-1 --> */}
    </Fragment>
  );
};

export default OrderCalendar;
