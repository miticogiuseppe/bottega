"use client";
import OrderCalendar from "../src/components/OrderCalendar";
import { useEffect, useState } from "react";
import { loadOrdersFromExcel } from "../src/utils/excelUtils";

export default function Home() {
  const [orders, setOrders] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const newOrders = await loadOrdersFromExcel(file);
      setOrders(newOrders);
    }
  };

  useEffect(() => {
    // Carica automaticamente il file Excel
    console.log("sto caricando il file excel");
    const fetchOrders = async () => {
      const response = await fetch("/data/APPMERCE-000.xlsx"); // Percorso aggiornato
      const blob = await response.blob();
      const newOrders = await loadOrdersFromExcel(blob);

      // console.log("Ordini caricati da public/data/APPMERCE-000.xlsx", newOrders);

      setOrders(newOrders);
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Calendario Ordini APPMERCE di Copral 📅
      </h1>
      <OrderCalendar orders={orders} />
    </div>
  );
}
