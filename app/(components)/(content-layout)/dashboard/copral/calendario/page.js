"use client";
import OrderCalendar from "@/components/OrderCalendar";
import { parseDates } from "@/utils/excelUtils";
import { useEffect, useState } from "react";
import { csvDecode } from "@/utils/csvDecode";
import { fetchCsvCached } from "@/utils/csvDecode";
import GlobalContext from "@/context/GlobalContext";

export default function Home() {
  const { username } = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);
  const [fileDate, setFileDate] = useState(undefined);

  useEffect(() => {
    // Carica automaticamente il file Excel
    const fetchOrders = async () => {
      const json = await fetchCsvCached(
        "/api/fetch-excel-json?id=APPMERCE-000&sheet=APPMERCE-000_1",
        undefined,
        username,
      );

      setFileDate(new Date(json.lwt));

      let newOrders = json.data;
      newOrders = parseDates(newOrders, ["Data Cons."]);
      setOrders(newOrders);
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <OrderCalendar data={orders} fileDate={fileDate} />
    </div>
  );
}
