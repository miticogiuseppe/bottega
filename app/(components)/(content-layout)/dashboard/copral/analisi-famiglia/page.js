"use client";

import React, { useState, useEffect, useMemo, Fragment } from "react";
import { Col, Row, Card, Form, Dropdown } from "react-bootstrap";
import SpkTablescomponent from "@/shared/@spk-reusable-components/reusable-tables/tables-component";
import SpkBadge from "@/shared/@spk-reusable-components/reusable-uielements/spk-badge";
import Spkcardscomponent from "@/shared/@spk-reusable-components/reusable-dashboards/spk-cards";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Preloader from "@/utils/Preloader";
import { PiMoneyThin, PiScalesThin, PiPackageThin } from "react-icons/pi";
import DateRangeFilter from "@/components/Copral/DaterangeFilter";
import SpkDropdown from "@/shared/@spk-reusable-components/reusable-uielements/spk-dropdown";

// ─── Formattatori ─────────────────────────────────────────────────────────────
const formatNum = (val, decimals = 2) => {
  const n = Number(val) || 0;
  const fixed = n.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decPart !== undefined ? `${intFormatted},${decPart}` : intFormatted;
};

const fmtEuro = (val) => `€ ${formatNum(val, 2)}`;

const fmtQty = (val, unit = "") =>
  `${formatNum(val, 2)}${unit ? ` ${unit}` : ""}`;

// ─── Componente riga multiselect ──────────────────────────────────────────────
const MultiSelectItem = ({ label, checked, onToggle, bold = false }) => (
  <Dropdown.Item
    as="div"
    onClick={(e) => e.stopPropagation()}
    style={{ cursor: "pointer" }}
    className="d-flex align-items-center gap-2 px-3 py-2"
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      onClick={(e) => e.stopPropagation()}
      className="form-check-input m-0 flex-shrink-0"
      style={{ cursor: "pointer" }}
      id={`chk-${label}`}
    />
    <label
      htmlFor={`chk-${label}`}
      className={`mb-0 w-100 ${bold ? "fw-semibold" : ""}`}
      style={{ cursor: "pointer" }}
    >
      {label}
    </label>
  </Dropdown.Item>
);

const AnalisiPerFamiglia = () => {
  const [sheetData, setSheetData] = useState(undefined);
  const [isFetching, setIsFetching] = useState(true);
  const [openFamilies, setOpenFamilies] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const cleanValue = (val) => {
    const s = String(val || "").trim();
    if (!s || s.toUpperCase().includes("INESISTENTE")) return "VUOTO";
    return s;
  };

  const excelDateToJS = (serial) => {
    if (!serial || isNaN(serial)) return null;
    return new Date((serial - 25569) * 86400 * 1000);
  };

  const handleFlatpickrChange = (dates) => {
    if (dates.length === 2) {
      const start = new Date(dates[0].setHours(0, 0, 0, 0));
      const end = new Date(dates[1].setHours(23, 59, 59, 999));
      setStartDate(start);
      setEndDate(end);
    } else if (dates.length === 0) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/api/fetch-excel-json?id=STATISTICA_VENDUTO_AGENTE",
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const json = await response.json();
        const rawData = json?.data ?? [];
        const parsedData = rawData.map((row) => ({
          ...row,
          DataObj:
            typeof row["Data"] === "number"
              ? excelDateToJS(row["Data"])
              : new Date(row["Data"]),
        }));
        setSheetData(parsedData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Errore STAVEN:", error);
          setSheetData([]);
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  // --- LISTE UNICHE ---
  const uniqueAgents = useMemo(() => {
    if (!sheetData) return [];
    return [
      ...new Set(sheetData.map((r) => cleanValue(r["Descrizione Agente"]))),
    ]
      .filter(Boolean)
      .sort();
  }, [sheetData]);

  const uniqueFamiliesList = useMemo(() => {
    if (!sheetData) return [];
    return [
      ...new Set(sheetData.map((r) => cleanValue(r["Descrizione Famiglia"]))),
    ]
      .filter(Boolean)
      .sort();
  }, [sheetData]);

  const uniqueGroupsList = useMemo(() => {
    if (!sheetData) return [];
    const source =
      selectedFamilies.length > 0
        ? sheetData.filter((r) =>
            selectedFamilies.includes(cleanValue(r["Descrizione Famiglia"])),
          )
        : sheetData;
    return [...new Set(source.map((r) => cleanValue(r["Descrizione Gruppo"])))]
      .filter(Boolean)
      .sort();
  }, [sheetData, selectedFamilies]);

  // --- TOGGLE AGENTI ---
  const toggleAgent = (a) => {
    setSelectedAgents((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };
  const toggleAllAgents = () => {
    if (selectedAgents.length === uniqueAgents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents([...uniqueAgents]);
    }
  };

  // --- TOGGLE FAMIGLIE ---
  const toggleFamily = (f) => {
    setSelectedFamilies((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
    setSelectedGroups([]);
  };
  const toggleAllFamilies = () => {
    if (selectedFamilies.length === uniqueFamiliesList.length) {
      setSelectedFamilies([]);
      setSelectedGroups([]);
    } else {
      setSelectedFamilies([...uniqueFamiliesList]);
    }
  };

  // --- TOGGLE GRUPPI ---
  const toggleGroup = (g) => {
    setSelectedGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };
  const toggleAllGroups = () => {
    if (selectedGroups.length === uniqueGroupsList.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups([...uniqueGroupsList]);
    }
  };

  const toggleFamilyRow = (nome) => {
    const next = new Set(openFamilies);
    next.has(nome) ? next.delete(nome) : next.add(nome);
    setOpenFamilies(next);
  };

  // --- LABEL DROPDOWN ---
  const agentToggleLabel =
    selectedAgents.length === 0
      ? "Tutti gli Agenti"
      : selectedAgents.length === 1
        ? selectedAgents[0]
        : `${selectedAgents.length} Agenti`;

  const familyToggleLabel =
    selectedFamilies.length === 0
      ? "Tutte le Famiglie"
      : selectedFamilies.length === 1
        ? selectedFamilies[0]
        : `${selectedFamilies.length} Famiglie`;

  const groupToggleLabel =
    selectedGroups.length === 0
      ? "Tutti i Gruppi"
      : selectedGroups.length === 1
        ? selectedGroups[0]
        : `${selectedGroups.length} Gruppi`;

  // --- ELABORAZIONE DATI ---
  const { matrix, allAgents, kpis, totalsByAgent } = useMemo(() => {
    if (!sheetData || !Array.isArray(sheetData))
      return {
        matrix: [],
        allAgents: [],
        kpis: { globalVal: 0, globalAlmQ: 0, globalAccQ: 0 },
        totalsByAgent: {},
      };

    const tree = {};
    const agentsSet = new Set();
    const agentTotals = {};
    let globalVal = 0,
      globalAlmQ = 0,
      globalAccQ = 0;

    sheetData.forEach((row) => {
      const agente = cleanValue(row["Descrizione Agente"]);
      const macro = cleanValue(row["Descrizione Famiglia"]).toUpperCase();
      const sotto = cleanValue(row["Descrizione Gruppo"]).toUpperCase();

      if (startDate && endDate) {
        const d = row.DataObj;
        if (!d || d < startDate || d > endDate) return;
      }

      if (selectedAgents.length > 0 && !selectedAgents.includes(agente)) return;
      if (
        selectedFamilies.length > 0 &&
        !selectedFamilies.map((f) => f.toUpperCase()).includes(macro)
      )
        return;
      if (
        selectedGroups.length > 0 &&
        !selectedGroups.map((g) => g.toUpperCase()).includes(sotto)
      )
        return;

      const valore = parseFloat(row["Valore"]) || 0;
      const qta = parseFloat(row["Quantita'"]) || 0;

      agentsSet.add(agente);
      globalVal += valore;
      if (macro.includes("ALLUMINIO")) globalAlmQ += qta;
      if (macro.includes("ACCESSORI")) globalAccQ += qta;

      if (!tree[macro])
        tree[macro] = { nome: macro, sotto: {}, agenti: {}, totV: 0 };
      if (!tree[macro].agenti[agente])
        tree[macro].agenti[agente] = { v: 0, q: 0 };
      tree[macro].agenti[agente].v += valore;
      tree[macro].agenti[agente].q += qta;
      tree[macro].totV += valore;

      if (!tree[macro].sotto[sotto])
        tree[macro].sotto[sotto] = { nome: sotto, agenti: {}, totV: 0 };
      if (!tree[macro].sotto[sotto].agenti[agente])
        tree[macro].sotto[sotto].agenti[agente] = { v: 0, q: 0 };
      tree[macro].sotto[sotto].agenti[agente].v += valore;
      tree[macro].sotto[sotto].agenti[agente].q += qta;
      tree[macro].sotto[sotto].totV += valore;

      if (!agentTotals[agente]) agentTotals[agente] = { v: 0, q: 0 };
      agentTotals[agente].v += valore;
      agentTotals[agente].q += qta;
    });

    return {
      matrix: Object.values(tree).sort((a, b) => a.nome.localeCompare(b.nome)),
      allAgents: Array.from(agentsSet).sort(),
      kpis: { globalVal, globalAlmQ, globalAccQ },
      totalsByAgent: agentTotals,
    };
  }, [
    sheetData,
    startDate,
    endDate,
    selectedAgents,
    selectedFamilies,
    selectedGroups,
  ]);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedAgents([]);
    setSelectedFamilies([]);
    setSelectedGroups([]);
    setSearchTerm("");
  };

  const hasActiveFilters =
    startDate !== null ||
    selectedAgents.length > 0 ||
    selectedFamilies.length > 0 ||
    selectedGroups.length > 0;

  const dynamicCards = [
    {
      id: 1,
      title: "Fatturato Totale",
      count: fmtEuro(kpis.globalVal),
      svgIcon: <PiMoneyThin />,
      backgroundColor: "primary svg-white",
    },
    {
      id: 2,
      title: "Totale Alluminio",
      count: fmtQty(kpis.globalAlmQ, "Kg"),
      svgIcon: <PiScalesThin />,
      backgroundColor: "primary3 svg-white",
    },
    {
      id: 3,
      title: "Totale Accessori",
      count: fmtQty(kpis.globalAccQ, "Pz"),
      svgIcon: <PiPackageThin />,
      backgroundColor: "info svg-white",
    },
  ];

  if (isFetching) return <Preloader show={true} />;

  return (
    <Fragment>
      <Seo title={"Analisi per Famiglia - Copral"} />
      <Pageheader
        title="Analisi per Famiglia"
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

          {/* DROPDOWN AGENTI */}
          <SpkDropdown
            toggleas="a"
            Customtoggleclass="btn btn-outline-light btn-sm border text-muted no-caret"
            Toggletext={agentToggleLabel}
            Arrowicon={true}
            autoClose="outside"
          >
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                minWidth: "220px",
              }}
            >
              <MultiSelectItem
                label="Tutti gli Agenti"
                bold
                checked={
                  uniqueAgents.length > 0 &&
                  selectedAgents.length === uniqueAgents.length
                }
                onToggle={toggleAllAgents}
              />
              <Dropdown.Divider className="my-1" />
              {uniqueAgents.map((a) => (
                <MultiSelectItem
                  key={a}
                  label={a}
                  checked={selectedAgents.includes(a)}
                  onToggle={() => toggleAgent(a)}
                />
              ))}
            </div>
          </SpkDropdown>

          {/* DROPDOWN FAMIGLIE */}
          <SpkDropdown
            toggleas="a"
            Customtoggleclass="btn btn-outline-light btn-sm border text-muted no-caret"
            Toggletext={familyToggleLabel}
            Arrowicon={true}
            autoClose="outside"
          >
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                minWidth: "220px",
              }}
            >
              <MultiSelectItem
                label="Tutte le Famiglie"
                bold
                checked={
                  uniqueFamiliesList.length > 0 &&
                  selectedFamilies.length === uniqueFamiliesList.length
                }
                onToggle={toggleAllFamilies}
              />
              <Dropdown.Divider className="my-1" />
              {uniqueFamiliesList.map((f) => (
                <MultiSelectItem
                  key={f}
                  label={f}
                  checked={selectedFamilies.includes(f)}
                  onToggle={() => toggleFamily(f)}
                />
              ))}
            </div>
          </SpkDropdown>

          {/* DROPDOWN GRUPPI */}
          <SpkDropdown
            toggleas="a"
            Customtoggleclass="btn btn-outline-light btn-sm border text-muted no-caret"
            Toggletext={groupToggleLabel}
            Arrowicon={true}
            autoClose="outside"
          >
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                minWidth: "220px",
              }}
            >
              <MultiSelectItem
                label="Tutti i Gruppi"
                bold
                checked={
                  uniqueGroupsList.length > 0 &&
                  selectedGroups.length === uniqueGroupsList.length
                }
                onToggle={toggleAllGroups}
              />
              <Dropdown.Divider className="my-1" />
              {uniqueGroupsList.map((g) => (
                <MultiSelectItem
                  key={g}
                  label={g}
                  checked={selectedGroups.includes(g)}
                  onToggle={() => toggleGroup(g)}
                />
              ))}
            </div>
          </SpkDropdown>

          {hasActiveFilters && (
            <button
              className="btn btn-danger-light btn-sm btn-icon"
              onClick={resetFilters}
              title="Reset filtri"
            >
              <i className="ti ti-refresh"></i>
            </button>
          )}
        </div>
      </Pageheader>

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

      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>Dettaglio Famiglie</Card.Title>
              <Form.Control
                type="text"
                placeholder="Cerca macro famiglia..."
                className="form-control-sm w-25"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <SpkTablescomponent
                  tableClass="table-bordered text-nowrap border-primary sticky-header"
                  header={[
                    { title: "FAMIGLIA / GRUPPO" },
                    ...allAgents.flatMap((ag) => [
                      { title: `${ag} (€)` },
                      { title: `${ag} (Q.tà)` },
                    ]),
                    { title: "TOT. VALORE (€)" },
                  ]}
                >
                  {matrix
                    .filter((m) =>
                      m.nome.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((macro) => (
                      <Fragment key={macro.nome}>
                        {/* RIGA FAMIGLIA */}
                        <tr
                          className="table-primary-transparent cursor-pointer"
                          onClick={() => toggleFamilyRow(macro.nome)}
                        >
                          <th scope="row" className="fw-bold text-start">
                            <i
                              className={`ri-arrow-${openFamilies.has(macro.nome) ? "down" : "right"}-s-line me-1 text-primary`}
                            ></i>
                            {macro.nome}
                          </th>
                          {allAgents.map((ag) => (
                            <Fragment key={ag}>
                              <td className="text-end fw-bold">
                                {fmtEuro(macro.agenti[ag]?.v || 0)}
                              </td>
                              <td className="text-end fw-bold">
                                {macro.nome.includes("ALLUMINIO") ? (
                                  <SpkBadge variant="primary">
                                    {fmtQty(macro.agenti[ag]?.q || 0, "Kg")}
                                  </SpkBadge>
                                ) : macro.nome.includes("ACCESSORI") ? (
                                  <SpkBadge variant="success">
                                    {fmtQty(macro.agenti[ag]?.q || 0, "Pz")}
                                  </SpkBadge>
                                ) : (
                                  fmtQty(macro.agenti[ag]?.q || 0)
                                )}
                              </td>
                            </Fragment>
                          ))}
                          <td className="text-end fw-bold text-primary bg-primary-transparent">
                            {fmtEuro(macro.totV)}
                          </td>
                        </tr>

                        {/* RIGHE SOTTOGRUPPO */}
                        {openFamilies.has(macro.nome) &&
                          Object.values(macro.sotto).map((sotto) => (
                            <tr key={sotto.nome}>
                              <td
                                className="ps-5 text-muted text-uppercase text-start"
                                style={{ fontSize: "10px" }}
                              >
                                <i className="ri-corner-down-right-line me-2"></i>
                                {sotto.nome}
                              </td>
                              {allAgents.map((ag) => (
                                <Fragment key={ag}>
                                  <td className="text-end text-muted">
                                    {fmtEuro(sotto.agenti[ag]?.v || 0)}
                                  </td>
                                  <td className="text-end text-muted">
                                    {fmtQty(sotto.agenti[ag]?.q || 0)}
                                  </td>
                                </Fragment>
                              ))}
                              <td className="text-end text-muted">
                                {fmtEuro(sotto.totV)}
                              </td>
                            </tr>
                          ))}
                      </Fragment>
                    ))}

                  {/* TOTALE COMPLESSIVO */}
                  <tr className="table-dark">
                    <th scope="row" className="text-start">
                      TOTALE COMPLESSIVO
                    </th>
                    {allAgents.map((ag) => (
                      <Fragment key={ag}>
                        <td className="text-end fw-bold">
                          {fmtEuro(totalsByAgent[ag]?.v || 0)}
                        </td>
                        <td className="text-end fw-bold">
                          {fmtQty(totalsByAgent[ag]?.q || 0)}
                        </td>
                      </Fragment>
                    ))}
                    <td className="text-end fw-bold">
                      {fmtEuro(kpis.globalVal)}
                    </td>
                  </tr>
                </SpkTablescomponent>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AnalisiPerFamiglia;
