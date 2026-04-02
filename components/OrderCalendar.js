import { useState, useCallback, Fragment, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import OrderListModal from "./OrderListModal";
import Pageheader from "../shared/layouts-components/page-header/pageheader";
import { Card, Col, Row } from "react-bootstrap";
import Seo from "../shared/layouts-components/seo/seo";
import SearchBox from "@/components/SearchBox";
import { formatDate, formatTime } from "@/utils/format";
import Spkcardscomponent from "@/shared/@spk-reusable-components/reusable-dashboards/spk-cards";
import { IoIosCalendar } from "react-icons/io";

const EMPTY_SEARCH = { search: "", selected: null };

const OrderCalendar = ({ data, fileDate }) => {
  const updateCard = {
    id: 1,
    title: "Ultimo aggiornamento",
    count: formatDate(fileDate),
    inc: formatTime(fileDate),
    svgIcon: <IoIosCalendar />,
    backgroundColor: "info svg-white",
    color: "success",
  };

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [agentSearch, setAgentSearch] = useState(EMPTY_SEARCH);
  const [clientSearch, setClientSearch] = useState(EMPTY_SEARCH);
  const [orderSearch, setOrderSearch] = useState(EMPTY_SEARCH);
  const [articleSearch, setArticleSearch] = useState(EMPTY_SEARCH);

  // ─── Chiavi per forzare il remount dei SearchBox al reset ────────────────
  const [resetKey, setResetKey] = useState(0);

  const hasActiveFilters =
    agentSearch.search ||
    agentSearch.selected ||
    clientSearch.search ||
    clientSearch.selected ||
    orderSearch.search ||
    orderSearch.selected ||
    articleSearch.search ||
    articleSearch.selected;

  const handleReset = () => {
    setAgentSearch(EMPTY_SEARCH);
    setClientSearch(EMPTY_SEARCH);
    setOrderSearch(EMPTY_SEARCH);
    setArticleSearch(EMPTY_SEARCH);
    setResetKey((k) => k + 1); // forza remount SearchBox
  };

  const handleEventClick = (info) => {
    const clickedDate = info.event.startStr;
    const ordiniGiorno = filteredData.filter((order) => {
      if (!order["Data Cons."]) return false;
      const dataOrd = order["Data Cons."].format("YYYY-MM-DD");
      return dataOrd === clickedDate;
    });
    setSelectedOrders(
      ordiniGiorno.map((order) => ({
        numOrdine: order["Nr.ord"] ?? "N/A",
        cliente: order["Ragione sociale"] ?? "N/A",
        articolo: order.Articolo ?? "N/A",
        quantità: order["Qta da ev"] ?? "N/A",
        sezione: order.Sez ?? "N/A",
        agente: order["Des. Agente"] ?? "N/A",
      })),
    );
  };

  const handleAgentSearch = useCallback((data) => setAgentSearch(data), []);
  const handleClientSearch = useCallback((data) => setClientSearch(data), []);
  const handleOrderSearch = useCallback((data) => setOrderSearch(data), []);
  const handleArticleSearch = useCallback((data) => setArticleSearch(data), []);

  function checkRow(row, column, searchData) {
    if (searchData.selected) {
      return String(row[column]) === String(searchData.selected);
    } else {
      if (row[column] && searchData.search) {
        return String(row[column])
          .toLowerCase()
          .includes(String(searchData.search).toLowerCase());
      } else return true;
    }
  }

  const filteredData = data.filter((order) => {
    const matchAgent = checkRow(order, "Des. Agente", agentSearch);
    const matchClient = checkRow(order, "Ragione sociale", clientSearch);
    const matchOrder = checkRow(order, "Nr.ord", orderSearch);
    const matchArticle = checkRow(order, "Articolo", articleSearch);
    return matchAgent && matchClient && matchOrder && matchArticle;
  });

  const eventsByDate = {};
  filteredData.forEach((order) => {
    if (!order["Data Cons."]) return;
    const data = order["Data Cons."].format("YYYY-MM-DD");
    if (!eventsByDate[data]) eventsByDate[data] = [];
    eventsByDate[data].push(order);
  });

  const formattedEvents = Object.entries(eventsByDate).flatMap(
    ([data, eventi]) => {
      const visibili = eventi.slice(0, 2).map((order) => ({
        title: order.Articolo ?? "Sconosciuto",
        start: data,
        extendedProps: {
          cliente: order["Ragione sociale"] ?? "N/A",
          quantità: order["Qta da ev"] ?? "N/A",
          sezione: order.Sez ?? "N/A",
          agente: order["Des. Agente"] ?? "N/A",
          numOrdine: order["Nr.ord"] ?? "N/A",
          articolo: order.Articolo ?? "N/A",
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
    },
  );

  const agents = Array.from(
    new Set(data.map((o) => String(o["Des. Agente"])).filter(Boolean)),
  );
  const clients = Array.from(
    new Set(data.map((o) => String(o["Ragione sociale"])).filter(Boolean)),
  );
  const orders = Array.from(
    new Set(data.map((o) => String(o["Nr.ord"])).filter(Boolean)),
  );
  const articles = Array.from(
    new Set(data.map((o) => String(o["Articolo"])).filter(Boolean)),
  );

  const filteredAgents = agents.filter(
    (c) =>
      !c || c.toLowerCase().includes((agentSearch.search || "").toLowerCase()),
  );
  const filteredClients = clients.filter(
    (c) =>
      !c || c.toLowerCase().includes((clientSearch.search || "").toLowerCase()),
  );
  const filteredOrders = orders.filter(
    (n) =>
      !n || n.toLowerCase().includes((orderSearch.search || "").toLowerCase()),
  );
  const filteredArticles = articles.filter(
    (a) =>
      !a ||
      a.toLowerCase().includes((articleSearch.search || "").toLowerCase()),
  );

  return (
    <Fragment>
      <Seo title="Calendario consegne" />
      <Pageheader title="Apps" currentpage="Calendario" />

      <Row className="mb-3">
        <Col xxl={3} xl={4} lg={6} md={6}>
          <Spkcardscomponent
            cardClass="overflow-hidden main-content-card"
            headingClass="d-block mb-1"
            mainClass="d-flex align-items-start justify-content-between mb-2"
            svgIcon={updateCard.svgIcon}
            card={updateCard}
            badgeClass="md"
            dataClass="mb-0"
          />
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card className="custom-card overflow-hidden">
            <Card.Header className="vertical-center">
              <span className="sc-title">Calendario consegne</span>
            </Card.Header>
            <Card.Body>
              {/* FILTRI ORIZZONTALI + TASTO RESET */}
              <div
                className="spacing mb-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr) auto",
                  gap: "20px",
                  width: "100%",
                  alignItems: "end",
                }}
              >
                <SearchBox
                  key={`agent-${resetKey}`}
                  data={filteredAgents}
                  name="Agente"
                  placeholder="Cerca agente..."
                  onSearch={handleAgentSearch}
                />
                <SearchBox
                  key={`client-${resetKey}`}
                  data={filteredClients}
                  name="Cliente"
                  placeholder="Cerca cliente..."
                  onSearch={handleClientSearch}
                />
                <SearchBox
                  key={`order-${resetKey}`}
                  data={filteredOrders}
                  name="N.Ordine"
                  placeholder="Cerca numero ordine..."
                  onSearch={handleOrderSearch}
                />
                <SearchBox
                  key={`article-${resetKey}`}
                  data={filteredArticles}
                  name="Articolo"
                  placeholder="Cerca articolo..."
                  onSearch={handleArticleSearch}
                />

                {/* TASTO RESET */}
                {hasActiveFilters ? (
                  <button
                    className="btn btn-danger-light btn-sm btn-icon"
                    onClick={handleReset}
                    title="Reset filtri"
                    style={{ height: "38px", alignSelf: "end" }}
                  >
                    <i className="ti ti-refresh"></i>
                  </button>
                ) : (
                  <div /> // placeholder per mantenere il grid
                )}
              </div>

              <FullCalendar
                plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={formattedEvents}
                eventClick={handleEventClick}
                height="auto"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <OrderListModal
        orders={selectedOrders}
        onClose={() => setSelectedOrders([])}
      />
    </Fragment>
  );
};

export default OrderCalendar;
