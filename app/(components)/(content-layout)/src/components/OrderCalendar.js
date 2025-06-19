import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import OrderListModal from "./OrderListModal";
import "./OrderCalendar.css";

const OrderCalendar = ({ orders }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Funzione per convertire le date di Excel in formato JavaScript
  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000).toISOString().split("T")[0]; // Ottiene YYYY-MM-DD
  };

  //Eventi per data
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
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
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
  );
};

export default OrderCalendar;
