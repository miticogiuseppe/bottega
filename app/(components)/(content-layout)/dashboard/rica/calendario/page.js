"use client";
import OrdersRica from "@/components/OrdersRica";
import { parseDates } from "@/utils/excelUtils";
import { useEffect, useState } from "react";
import { csvDecode } from "@/utils/csvDecode";
import { fetchCsvCached } from "@/utils/csvDecode";
import GlobalContext from "@/context/GlobalContext";

export default function Home() {
  const { username } = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Carica automaticamente il file Excel
    const fetchOrders = async () => {
      const json = await fetchCsvCached(
        "/api/fetch-excel-json?id=ANALISI&sheet=_0000",
        undefined,
        username,
      );
      let newOrders = json.data;
      newOrders = parseDates(newOrders, ["Data prevista consegna"]);
      setOrders(newOrders);
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <OrdersRica data={orders} />
    </div>
  );
}
