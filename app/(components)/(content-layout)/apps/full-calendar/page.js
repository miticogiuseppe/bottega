"use client"
import Pageheader from "../../../../../shared/layouts-components/page-header/pageheader";
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import SimpleBar from "simplebar-react";
import SpkButton from "../../../../../shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkBadge from "../../../../../shared/@spk-reusable-components/reusable-uielements/spk-badge";
import listPlugin from "@fullcalendar/list";
import Seo from "../../../../../shared/layouts-components/seo/seo";
import * as XLSX from "xlsx";

const readExcel = async () => {
  try {
    const response = await fetch("/APPMERCE-000.xlsx");
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rawData.length < 2) {
      console.error("Errore: Il file sembra vuoto!");
      return [];
    }

    const columnNames = rawData[0];
    const formattedData = rawData.slice(1).map(row => {
      let obj = {};
      columnNames.forEach((colName, index) => {
        obj[colName] = row[index] || "";
      });
      return obj;
    });

    console.log("Dati estratti:", formattedData); // ✅ Controlla i dati nella console
    return formattedData;
  } catch (error) {
    console.error("Errore nella lettura del file Excel:", error);
    return [];
  }
};



const FullCalender = () => {

  const [events, setEvents] = useState([]);
  const [tableData, setTableData] = useState([]);



  let eventGuid = 0;
  const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
  const INITIAL_EVENTS = [
    {
      id: createEventId(),
      title: "Meeting",
      start: todayStr,
    },
    {
      id: createEventId(),
      title: "Meeting Time",
      start: todayStr + "T16:00:00",
    },
  ];

  function createEventId() {
    return String(eventGuid++);
  }
  const initialstate1 = {
    calendarEvents: [
      {
        title: "Atlanta Monster",
        start: new Date("2019-04-04 00:00"),
        id: "1001",
      },
      {
        title: "My Favorite Murder",
        start: new Date("2019-04-05 00:00"),
        id: "1002",
      },
    ],

    events: [
      {
        title: "Calendar Events",
        id: "1",
        bg: "primary",
      },
      {
        title: "Birthday Events",
        id: "2",
        bg: "primary1",
      },
      {
        title: "Holiday Calendar",
        id: "3",
        bg: "primary2",
      },
      {
        title: "Office Events",
        id: "4",
        bg: "primary3",
        border: "border-info-transparent"
      },
      {
        title: "Other Events",
        id: "5",
        bg: "secondary",
      },
      {
        title: "Festival Events",
        id: "6",
        bg: "danger",
      },
      {
        title: "Timeline Events",
        id: "7",
        bg: "success",
      },
      {
        title: "Other Events",
        id: "8",
        bg: "info",
      },
    ],
  };
  const [state] = useState(initialstate1);

  useEffect(() => {
    const fetchEvents = async () => {
      const excelEvents = await readExcel();
      setEvents(excelEvents);
      setTableData(excelEvents); // 📌 Salva anche i dati per la finestra
    };
    fetchEvents();
    const draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        const title = eventEl.getAttribute("title");
        const id = eventEl.getAttribute("data");
        const classValue = eventEl.getAttribute("class");
        return {
          title: title,
          id: id,
          className: classValue,
        };
      },
    });
  }, []);

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }
  const handleEventClick = (clickInfo) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };
  const handleEvents = () => { };

  const handleDateSelect = (selectInfo) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const openDataWindow = () => {
    if (!tableData || tableData.length === 0) {
      alert("Nessun dato disponibile!");
      return;
    }
  
    const newWindow = window.open("", "_blank");
  
    if (!newWindow) {
      alert("Errore: impossibile aprire la finestra!");
      return;
    }
  
    const content = `
      <html>
        <head>
          <title>Dati Ordini</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; }
            .container { max-width: 100%; margin: auto; }
            .card { border: 1px solid #dee2e6; border-radius: 10px; padding: 15px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
            .table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; text-align: left; border: 1px solid #dee2e6; }
            th { background-color: #007bff; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <h2 class="text-center">Dati Ordini</h2>
              <table class="table table-striped table-bordered">
                <thead>
                  <tr>${Object.keys(tableData[0] || {}).map(col => `<th>${col}</th>`).join("")}</tr>
                </thead>
                <tbody>
                  ${tableData.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join("")}</tr>`).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;
  
    newWindow.document.write(content);
    newWindow.document.close();
  };
  
  
  // render() {
  return (
    <Fragment>
      {/* <!-- Page Header --> */}
      <Seo title="Full-Calender" />
      <Pageheader title="Apps" currentpage="Full Calender" activepage="Full Calender" />

      {/* <!-- Page Header Close --> */}

      {/* <!-- Start::row-1 --> */}
      <Row>
        <Col xl={9}>
          <Card className="custom-card overflow-hidden">
            <Card.Header className="">
              <div className="card-title">Full Calendar</div>
            </Card.Header>
            <Card.Body className="">
              <div id='calendar2' className="overflow-hidden">
                <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                  headerToolbar={{ 
                    left: "prev,next today", 
                    center: "title", 
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek" 
                  }}
                  initialView="dayGridMonth" 
                  editable={true} 
                  selectable={true} 
                  selectMirror={true} 
                  dayMaxEvents={true}
                  events={events}
                  select={handleDateSelect}
                  eventContent={renderEventContent}
                  eventClick={handleEventClick}
                  initialEvents={INITIAL_EVENTS} select={handleDateSelect} eventContent={renderEventContent} eventClick={handleEventClick}
                  eventsSet={handleEvents}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className=" justify-content-between">
              <div className="card-title">All Events</div>
              <SpkButton Buttonvariant="primary"><i className="ri-add-line align-middle me-1 fw-medium d-inline-block"></i>Create New Event</SpkButton>
            </Card.Header>
            <Card.Body className=" p-0">
              <ul id="external-events" className="mb-0 p-3 list-unstyled column-list">
                {state.events.map((event) => (
                  <div
                    className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event bg-${event.bg}-transparent border ${event.border}`}
                    title={event.title}
                    key={event.id}>
                    <div className={`fc-event-main text-${event.bg}`}>{event.title}</div>
                  </div>
                ))}
              </ul>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Header className=" justify-content-between pb-1">
              <div className="card-title">
                Activity :
              </div>
              <SpkButton Buttonvariant="primary-light" Size="sm">View All</SpkButton>
            </Card.Header>
            <CardBody className=" p-0 card-body">
              <SimpleBar className="p-3" id="full-calendar-activity">
                <ul className="list-unstyled mb-0 fullcalendar-events-activity">
                  <li>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <p className="mb-1 fw-medium">Tuesday, Feb 5, 2024</p>
                      <SpkBadge variant="light" Customclass="text-default mb-1">10:00AM - 11:00AM</SpkBadge>
                    </div>
                    <p className="mb-0 text-muted fs-12">Discussion with team on project updates.</p>
                  </li>
                  <li>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <p className="mb-1 fw-medium">Monday, Jan 2, 2023</p>
                      <SpkBadge variant="success" Customclass="mb-1">Completed</SpkBadge>
                    </div>
                    <p className="mb-0 text-muted fs-12">Review and finalize budget proposal.</p>
                  </li>
                  <li>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <p className="mb-1 fw-medium">Thursday, Mar 8, 2024</p>
                      <SpkBadge variant="warning-transparent" Customclass="mb-1">Reminder</SpkBadge>
                    </div>
                    <p className="mb-0 text-muted fs-12">Prepare presentation slides for client meeting.</p>
                  </li>
                  <li>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <p className="mb-1 fw-medium">Friday, Apr 12, 2024</p>
                      <SpkBadge variant="light" Customclass="text-default mb-1">2:00PM - 4:00PM</SpkBadge>
                    </div>
                    <p className="mb-0 text-muted fs-12">Training session on new software tools.</p>
                  </li>
                  <li>
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <p className="mb-1 fw-medium">Saturday, Mar 16, 2024</p>
                      <SpkBadge variant="danger-transparent" Customclass="mb-1">Due Date</SpkBadge>
                    </div>
                    <p className="mb-0 text-muted fs-12">Submit quarterly report to management.</p>
                  </li>
                </ul>
              </SimpleBar>

            </CardBody>
          </Card>
        </Col>
      </Row>
       {/* ✅ Tabella per mostrare i dati dell'Excel */}
       <Card className="custom-card mt-4">
  <Card.Header>
    <div className="card-title">Dati Ordini</div>
  </Card.Header>
  <Card.Body>
    <table className="table table-striped table-bordered">
      <thead className="table-primary">
        <tr>
          {["Prog", "Des. Agente", "Cli", "Ragione sociale", "Data ord", "Sez", "Nr.ord", "Articolo", "Descrizione", "Data Cons.", "Qta da ev", "QTAev II UM"].map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td>{row["Prog"]}</td>
            <td>{row["Des. Agente"]}</td>
            <td>{row["Cli"]}</td>
            <td>{row["Ragione sociale"]}</td>
            <td><SpkBadge variant="primary">{row["Data ord"]}</SpkBadge></td>
            <td>{row["Sez"]}</td>
            <td><SpkBadge variant="primary1">{row["Nr.ord"]}</SpkBadge></td>
            <td><SpkBadge variant="primary3">{row["Articolo"]}</SpkBadge></td>
            <td>{row["Descrizione"]}</td>
            <td>{row["Data Cons."]}</td>
            <td>{row["Qta da ev"]}</td>
            <td>{row["QTAev II UM"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card.Body>
</Card>


      {/* 📌 Pulsante per aprire la finestra con la tabella */}
      <SpkButton Buttonvariant="primary" onClick={openDataWindow}>
        Apri Tabella Ordini
      </SpkButton>
      {/* <!--End::row-1 --> */}
    </Fragment>
  )
}
// };

export default FullCalender;