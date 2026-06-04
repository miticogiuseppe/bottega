"use client";
import OrdersDibartolo from "@/components/OrdersDibartolo";
import { csvDecode } from "@/utils/csvDecode";
import { parseDates } from "@/utils/excelUtils";
import { useEffect, useState } from "react";
import { fetchCsvCached } from "@/utils/csvDecode";
import GlobalContext from "@/context/GlobalContext";

export default function Calendar() {
  const { username } = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Carica automaticamente il file Excel
    const fetchOrders = async () => {
      const json = await fetchCsvCached(
        "/api/fetch-excel-json?id=ANALISI&sheet=appmerce_db",
        undefined,
        username,
      );
      let newOrders = json.data;
      newOrders = parseDates(newOrders, ["Data cons. rich."]);
      setOrders(newOrders);
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <OrdersDibartolo data={orders} />
    </div>
  );
}
