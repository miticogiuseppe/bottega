import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import OrderListModal from "./OrderListModal";

const OrderCalendar = ({ orders }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  // const formattedEvents = orders.map((order) => ({
  //   title: order.Prodotto ?? "Sconosciuto",
  //   start: order["Data Ordine"].split("/").reverse().join("-"),
  //   extendedProps: {
  //     cliente: order["Cliente"] ?? "N/A",
  //     quantità: order["Quantità"] ?? "N/A",
  //     stato: order["Stato"] ?? "N/A"
  //   },
  // }));

  const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000).toISOString().split("T")[0]; // Ottiene YYYY-MM-DD
};

// orders.forEach(order => console.log("Tipo Data ord:", typeof order["Data ord"], "Valore:", order["Data ord"]));
   const formattedEvents = orders.map((order) => ({
  title: order.Articolo ?? "Sconosciuto",
  start: typeof order["Data ord"] === "number"
         ? excelDateToJSDate(order["Data ord"])  // Converti il numero in data
         : order["Data ord"].replace(/\//g, "-"), // Se fosse stringa, correggi separatori
  extendedProps: {
    cliente: order.Cli ?? "N/A",
    quantità: order["Qta da ev"] ?? "N/A",
    sezione: order.Sez ?? "N/A"
  },
}));

// formattedEvents.forEach(event => console.log("Data evento trasformata:", event.start));


 const handleEventClick = (info) => {
  const clickedDate = info.event.startStr;
  const ordersForDate = formattedEvents.filter(event => event.start === clickedDate);
  setSelectedOrders(ordersForDate.map(e => e.extendedProps));
};

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={formattedEvents}
        eventClick={handleEventClick}
      />
<OrderListModal
  orders={selectedOrders}
  onClose={() => setSelectedOrders([])}
/>

    </div>
  );
};

export default OrderCalendar;