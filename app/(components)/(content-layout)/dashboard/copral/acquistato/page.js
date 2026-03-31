"use client";
import React, { useEffect, useState, useMemo, Fragment } from "react";
import { Row, Col, Card, Form, Dropdown } from "react-bootstrap";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Preloader from "@/utils/Preloader";
import SpkBadge from "@/shared/@spk-reusable-components/reusable-uielements/spk-badge";
import Spkcardscomponent from "@/shared/@spk-reusable-components/reusable-dashboards/spk-cards";
import SpkDropdown from "@/shared/@spk-reusable-components/reusable-uielements/spk-dropdown";
import DateRangeFilter from "@/components/Copral/DaterangeFilter";
import { PiMoneyThin, PiScalesThin, PiPackageThin } from "react-icons/pi";
import { useRouter } from "next/navigation";

const AcquistatoPage = () => {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sheetData, setSheetData] = useState(undefined);
  const [isFetching, setIsFetching] = useState(true);

  const [openFamilies, setOpenFamilies] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("Tutti i Fornitori");
  const [selectedFamily, setSelectedFamily] = useState("Tutte le Famiglie");

  // ─────────────────────────────────────────────
  // UTILS
  // ─────────────────────────────────────────────
  const cleanValue = (val) => {
    const s = String(val || "").trim();
    if (!s || s.toUpperCase().includes("INESISTENTE")) return "VUOTO";
    return s;
  };

  const normalizaFamiglia = (famRaw) => {
    let f = famRaw.toUpperCase().trim();
    if (f === "EFFETTO LEGNO ACCIAIO" || f === "EFFETTO LEGNO/ACCIAIO") {
      return "EFF. LGN/ACC.";
    }
    return f;
  };

  const handleFlatpickrChange = (dates) => {
    if (dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else if (dates.length === 0) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const toggleFamily = (nome) => {
    const next = new Set(openFamilies);
    next.has(nome) ? next.delete(nome) : next.add(nome);
    setOpenFamilies(next);
  };

  // ─────────────────────────────────────────────
  // 1. FETCH SESSIONE + GUARD + DATI
  // ─────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;

      if (role !== "DIREZIONE") {
        router.push("/dashboard/copral");
        return;
      }

      setSession(sessionData?.user ?? null);
      setIsAuthorized(true);

      try {
        const response = await fetch(
          "/api/fetch-excel-json?id=STATISTICA_ACQUISTATO",
        );
        const json = await response.json();
        const rawData = json?.data ?? [];

        // Normalizza la data a mezzanotte per evitare problemi di confronto
        const parsedData = rawData.map((row) => {
          let dateObj = null;
          const raw = row["Data"];
          if (raw) {
            if (typeof raw === "number") {
              dateObj = new Date((raw - 25569) * 86400 * 1000);
            } else {
              dateObj = new Date(raw);
            }
            dateObj.setHours(0, 0, 0, 0);
          }
          return { ...row, DataObj: dateObj };
        });

        setSheetData(parsedData);
      } catch {
        setSheetData([]);
      } finally {
        setIsFetching(false);
      }
    };

    init();
  }, [router]);

  // ─────────────────────────────────────────────
  // 2. AGGREGAZIONE: Famiglia → Fornitori
  // ─────────────────────────────────────────────
  const { matrixData, kpis } = useMemo(() => {
    if (!sheetData || !sheetData.length) return { matrixData: [], kpis: {} };

    // Normalizza range date selezionato
    let start = null;
    let end = null;
    if (startDate && endDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    const grouped = {};
    let globalVal = 0,
      globalAlmQ = 0,
      globalAccQ = 0;

    sheetData.forEach((row) => {
      const fornitoreNome = cleanValue(row["Descrizione Cliente/Fornitore"]);
      const famRaw = cleanValue(row["Descrizione Famiglia"]);

      // Filtro data
      if (start && end) {
        const d = row.DataObj;
        if (!d || d < start || d > end) return;
      }

      // Filtro fornitore
      if (
        selectedSupplier !== "Tutti i Fornitori" &&
        fornitoreNome !== selectedSupplier
      )
        return;

      // Filtro famiglia — confronta sulla versione normalizzata
      if (
        selectedFamily !== "Tutte le Famiglie" &&
        normalizaFamiglia(famRaw) !== normalizaFamiglia(selectedFamily)
      )
        return;

      const famiglia = normalizaFamiglia(famRaw);
      const valore = parseFloat(row["Valore"]) || 0;
      const qta = parseFloat(row["Quantita'"]) || 0;

      globalVal += valore;
      if (famiglia.includes("ALLUMINIO")) globalAlmQ += qta;
      if (famiglia.includes("ACCESSORI")) globalAccQ += qta;

      if (!grouped[famiglia]) {
        grouped[famiglia] = {
          nome: famiglia,
          fornitori: {},
          totVal: 0,
          totQ: 0,
        };
      }

      if (!grouped[famiglia].fornitori[fornitoreNome]) {
        grouped[famiglia].fornitori[fornitoreNome] = {
          nome: fornitoreNome,
          totVal: 0,
          totQ: 0,
        };
      }

      grouped[famiglia].fornitori[fornitoreNome].totVal += valore;
      grouped[famiglia].fornitori[fornitoreNome].totQ += qta;
      grouped[famiglia].totVal += valore;
      grouped[famiglia].totQ += qta;
    });

    return {
      matrixData: Object.values(grouped).sort((a, b) => {
        if (a.nome === "ALTRO") return 1;
        if (b.nome === "ALTRO") return -1;
        if (a.nome === "VUOTO") return 1;
        if (b.nome === "VUOTO") return -1;
        return a.nome.localeCompare(b.nome);
      }),
      kpis: { globalVal, globalAlmQ, globalAccQ },
    };
  }, [sheetData, startDate, endDate, selectedSupplier, selectedFamily]);

  // Ricerca su famiglia o fornitore
  const filteredData = useMemo(() => {
    if (!searchTerm) return matrixData;
    const t = searchTerm.toLowerCase();
    return matrixData
      .map((fam) => {
        if (fam.nome.toLowerCase().includes(t)) return fam;
        const fornitoriFiltrati = Object.values(fam.fornitori).filter((f) =>
          f.nome.toLowerCase().includes(t),
        );
        if (fornitoriFiltrati.length) {
          return {
            ...fam,
            fornitori: Object.fromEntries(
              fornitoriFiltrati.map((f) => [f.nome, f]),
            ),
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [matrixData, searchTerm]);

  // Dropdown dinamici
  const uniqueSuppliers = useMemo(() => {
    if (!sheetData?.length) return ["Tutti i Fornitori"];
    const list = [
      ...new Set(
        sheetData.map((r) => cleanValue(r["Descrizione Cliente/Fornitore"])),
      ),
    ]
      .filter(Boolean)
      .sort();
    return ["Tutti i Fornitori", ...list];
  }, [sheetData]);

  const uniqueFamiliesList = useMemo(() => {
    if (!sheetData?.length) return ["Tutte le Famiglie"];
    const list = [
      ...new Set(
        sheetData.map((r) =>
          normalizaFamiglia(cleanValue(r["Descrizione Famiglia"])),
        ),
      ),
    ]
      .filter(Boolean)
      .sort();
    const sorted = list.filter((f) => f !== "VUOTO" && f !== "ALTRO").sort();
    const tail = ["VUOTO", "ALTRO"].filter((f) => list.includes(f));
    return ["Tutte le Famiglie", ...sorted, ...tail];
  }, [sheetData]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  if (isFetching) return <Preloader show={true} />;
  if (!isAuthorized) return null;

  const dynamicCards = [
    {
      id: 1,
      title: "Acquistato Totale",
      count: `€ ${kpis.globalVal?.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      svgIcon: <PiMoneyThin />,
      backgroundColor: "primary svg-white",
    },
    {
      id: 2,
      title: "Totale Alluminio",
      count: `${kpis.globalAlmQ?.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} Kg`,
      svgIcon: <PiScalesThin />,
      backgroundColor: "primary3 svg-white",
    },
    {
      id: 3,
      title: "Totale Accessori",
      count: `${kpis.globalAccQ?.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} Pz`,
      svgIcon: <PiPackageThin />,
      backgroundColor: "info svg-white",
    },
  ];

  return (
    <>
      <Seo title={"Statistiche Acquistato Copral"} />
      <Pageheader
        title="Statistiche Acquistato"
        currentpage="Copral"
        activepage="Dashboard"
        showActions={true}
      >
        <div
          className="d-flex flex-wrap gap-2 align-items-center"
          style={{ overflow: "visible" }}
        >
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleFlatpickrChange}
          />

          <SpkDropdown
            toggleas="a"
            Customtoggleclass="btn btn-outline-light btn-sm border text-muted no-caret"
            Toggletext={selectedSupplier}
            Arrowicon={true}
          >
            <div
              className="dropdown-menu-filter"
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                minWidth: "250px",
              }}
            >
              {uniqueSuppliers.map((s) => (
                <Dropdown.Item key={s} onClick={() => setSelectedSupplier(s)}>
                  {s}
                </Dropdown.Item>
              ))}
            </div>
          </SpkDropdown>

          <SpkDropdown
            toggleas="a"
            Customtoggleclass="btn btn-outline-light btn-sm border text-muted no-caret"
            Toggletext={selectedFamily}
            Arrowicon={true}
          >
            <div
              className="dropdown-menu-filter"
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              {uniqueFamiliesList.map((f) => (
                <Dropdown.Item key={f} onClick={() => setSelectedFamily(f)}>
                  {f}
                </Dropdown.Item>
              ))}
            </div>
          </SpkDropdown>

          {(startDate ||
            selectedSupplier !== "Tutti i Fornitori" ||
            selectedFamily !== "Tutte le Famiglie") && (
            <button
              className="btn btn-danger-light btn-sm btn-icon"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setSelectedSupplier("Tutti i Fornitori");
                setSelectedFamily("Tutte le Famiglie");
              }}
              title="Reset filtri"
            >
              <i className="ti ti-refresh"></i>
            </button>
          )}
        </div>
      </Pageheader>

      {/* KPI CARDS */}
      <Row>
        {dynamicCards.map((card) => (
          <Col xxl={4} xl={4} lg={6} key={card.id}>
            <Spkcardscomponent
              cardClass="overflow-hidden main-content-card"
              mainClass="d-flex align-items-center justify-content-between flex-nowrap"
              card={card}
              svgIcon={card.svgIcon}
            />
          </Col>
        ))}
      </Row>

      {/* TABELLA FAMIGLIA → FORNITORI */}
      <Row className="mt-4">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>Analisi Dettagliata Acquisti per Famiglia</Card.Title>
              <Form.Control
                type="text"
                placeholder="Cerca famiglia o fornitore..."
                className="form-control-sm w-25"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Card.Header>
            <Card.Body>
              <div className="table-responsive border rounded">
                <table className="table table-bordered text-nowrap border-primary sticky-header mb-0">
                  <thead className="table-primary">
                    <tr>
                      <th className="align-middle text-center border">
                        FAMIGLIA / FORNITORE
                      </th>
                      <th className="align-middle text-center border">
                        VALORE (€)
                      </th>
                      <th className="align-middle text-center border">Q.TÀ</th>
                      <th className="align-middle text-center border">
                        TOTALE (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-4">
                          Nessun dato disponibile per i filtri selezionati.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((fam) => (
                        <Fragment key={fam.nome}>
                          {/* ── RIGA FAMIGLIA ── */}
                          <tr
                            className="table-primary-transparent"
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleFamily(fam.nome)}
                          >
                            <th scope="row" className="fw-bold">
                              <i
                                className={`ri-arrow-${
                                  openFamilies.has(fam.nome) ? "down" : "right"
                                }-s-line me-1 text-primary`}
                              ></i>
                              {fam.nome}
                            </th>
                            <td className="text-end fw-bold">
                              €{" "}
                              {fam.totVal.toLocaleString("it-IT", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="text-center">
                              {fam.nome.includes("ALLUMINIO") ? (
                                <SpkBadge variant="primary">
                                  {fam.totQ.toLocaleString("it-IT")} Kg
                                </SpkBadge>
                              ) : fam.nome.includes("ACCESSORI") ? (
                                <SpkBadge variant="success">
                                  {fam.totQ.toLocaleString("it-IT")} Pz
                                </SpkBadge>
                              ) : (
                                <span className="text-muted">
                                  {fam.totQ.toLocaleString("it-IT")}
                                </span>
                              )}
                            </td>
                            <td className="text-end fw-bold text-primary bg-primary-transparent">
                              €{" "}
                              {fam.totVal.toLocaleString("it-IT", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>

                          {/* ── RIGHE FORNITORI (espanse) ── */}
                          {openFamilies.has(fam.nome) &&
                            Object.values(fam.fornitori)
                              .sort((a, b) => b.totVal - a.totVal)
                              .map((fornitore) => (
                                <tr
                                  key={fornitore.nome}
                                  className="table-hover"
                                >
                                  <td
                                    className="ps-5 text-muted text-uppercase"
                                    style={{ fontSize: "10px" }}
                                  >
                                    <i className="ri-corner-down-right-line me-2"></i>
                                    {fornitore.nome}
                                  </td>
                                  <td className="text-end text-muted">
                                    €{" "}
                                    {fornitore.totVal.toLocaleString("it-IT", {
                                      minimumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td className="text-center text-muted">
                                    {fornitore.totQ.toLocaleString("it-IT")}
                                  </td>
                                  <td className="text-end fw-medium text-muted">
                                    €{" "}
                                    {fornitore.totVal.toLocaleString("it-IT", {
                                      minimumFractionDigits: 2,
                                    })}
                                  </td>
                                </tr>
                              ))}
                        </Fragment>
                      ))
                    )}

                    {/* ── TOTALE COMPLESSIVO ── */}
                    <tr className="table-dark">
                      <th scope="row">TOTALE COMPLESSIVO</th>
                      <td className="text-end fw-bold">
                        €{" "}
                        {kpis.globalVal?.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center fw-bold">
                        {kpis.globalAlmQ?.toLocaleString("it-IT")} Kg
                      </td>
                      <td className="text-end fw-bold">
                        €{" "}
                        {kpis.globalVal?.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AcquistatoPage;
