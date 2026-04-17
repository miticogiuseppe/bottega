"use client";

import { useState, useRef, useCallback } from "react";

const CATEGORIES = [
  {
    id: "coge",
    label: "COGE",
    subfolders: ["ARCHIVIAZIONE", "CSV", "DETTCOSTI_RICAVI"],
    color: "#1a56db",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    id: "indici",
    label: "INDICI",
    subfolders: [],
    color: "#0f766e",
    bg: "#f0fdf9",
    border: "#99f6e4",
  },
  {
    id: "investimenti",
    label: "INVESTIMENTI",
    subfolders: [],
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
  },
  {
    id: "traffico",
    label: "TRAFFICO",
    subfolders: ["CIY", "CTA"],
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

const ICONS = {
  coge: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  indici: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  investimenti: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  traffico: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  ),
};

async function uploadFiles(files, category, subfolder = null) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("category", category);
  if (subfolder) formData.append("subfolder", subfolder);

  const res = await fetch("/api/upload-sac", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload fallito");
  return res.json();
}

function LoadingOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(6px)",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        <div style={{ position: "relative", width: "52px", height: "52px" }}>
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            style={{
              animation: "spin 1s linear infinite",
              position: "absolute",
            }}
          >
            <circle
              cx="26"
              cy="26"
              r="22"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
            />
            <circle
              cx="26"
              cy="26"
              r="22"
              fill="none"
              stroke="#1a56db"
              strokeWidth="4"
              strokeDasharray="100"
              strokeDashoffset="65"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Caricamento in corso...
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
            Trasferimento file nel drive
          </p>
        </div>
      </div>
    </div>
  );
}

function SubfolderModal({ category, files, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          padding: "28px 20px 36px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Handle bar */}
        <div
          style={{
            width: "40px",
            height: "4px",
            borderRadius: "2px",
            background: "#e2e8f0",
            margin: "0 auto 24px",
          }}
        />

        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: "#94a3b8",
            fontWeight: 600,
            textTransform: "uppercase",
            margin: "0 0 6px",
          }}
        >
          Destinazione
        </p>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Seleziona cartella in {category.label}
        </h2>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}>
          {files.length} file{" "}
          {files.length === 1 ? "selezionato" : "selezionati"}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          {category.subfolders.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelected(sub)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 18px",
                border: `1.5px solid ${selected === sub ? category.color : "#e2e8f0"}`,
                borderRadius: "12px",
                background: selected === sub ? category.bg : "#fafafa",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: selected === sub ? category.bg : "#f1f5f9",
                  border: `1px solid ${selected === sub ? category.border : "#e2e8f0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={selected === sub ? category.color : "#94a3b8"}
                  strokeWidth="2"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: selected === sub ? category.color : "#1e293b",
                }}
              >
                {sub}
              </p>
              {selected === sub && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: category.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              background: "#fff",
              color: "#64748b",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Annulla
          </button>
          {selected && (
            <button
              onClick={() => onConfirm(selected)}
              style={{
                flex: 2,
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background: category.color,
                color: "#fff",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
              >
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              Carica in {selected}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadZone({ category, onUpload, onDirectUpload }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);

  const doUpload = useCallback(
    async (arr, subfolder = null) => {
      setStatus("uploading");
      try {
        await onDirectUpload(arr, category.label, subfolder);
        setStatus("success");
        setTimeout(() => {
          setFiles([]);
          setStatus(null);
          if (inputRef.current) inputRef.current.value = "";
        }, 2500);
      } catch {
        setStatus("error");
        setTimeout(() => {
          setFiles([]);
          setStatus(null);
          if (inputRef.current) inputRef.current.value = "";
        }, 3000);
      }
    },
    [category, onDirectUpload],
  );

  const handleFiles = useCallback(
    (incoming) => {
      const arr = Array.from(incoming);
      setFiles(arr);
      setStatus(null);
      if (category.subfolders.length > 0) {
        onUpload(category, arr);
      } else {
        doUpload(arr, null);
      }
    },
    [category, onUpload, doUpload],
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${dragging ? category.color : "#e8edf3"}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.2s",
        boxShadow: dragging
          ? `0 0 0 3px ${category.bg}`
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 18px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: category.bg,
            border: `1px solid ${category.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: category.color,
            flexShrink: 0,
          }}
        >
          {ICONS[category.id]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {category.label}
          </h3>
          {category.subfolders.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
                marginTop: "4px",
              }}
            >
              {category.subfolders.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    padding: "2px 7px",
                    borderRadius: "5px",
                    background: category.bg,
                    color: category.color,
                    border: `1px solid ${category.border}`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => status === null && inputRef.current?.click()}
        style={{
          padding: "24px 18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          cursor: status === null ? "pointer" : "default",
          background: dragging ? category.bg : "transparent",
          transition: "background 0.2s",
          minHeight: "130px",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onClick={() => {
            if (inputRef.current) inputRef.current.value = "";
          }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {status === "success" ? (
          <>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#f0fdf4",
                border: "1.5px solid #86efac",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: "#16a34a",
              }}
            >
              Caricamento completato
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              {files.length} file trasferiti con successo
            </p>
          </>
        ) : status === "error" ? (
          <>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#fef2f2",
                border: "1.5px solid #fca5a5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: "#dc2626",
              }}
            >
              Errore nel caricamento
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Riprova o controlla il percorso
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: dragging ? category.bg : "#f8fafc",
                border: `1.5px dashed ${dragging ? category.color : "#cbd5e1"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={dragging ? category.color : "#94a3b8"}
                strokeWidth="1.5"
              >
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: dragging ? category.color : "#334155",
                textAlign: "center",
              }}
            >
              {dragging ? "Rilascia i file qui" : "Tocca per selezionare"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
                textAlign: "center",
              }}
            >
              {category.subfolders.length > 0
                ? "Sceglierai la sottocartella dopo"
                : "I file verranno caricati automaticamente"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function SacGenerale() {
  const [modal, setModal] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  const handleUpload = (category, files) => {
    if (category.subfolders.length > 0) {
      setModal({ category, files });
    }
  };

  const handleConfirm = async (subfolder) => {
    const { category, files } = modal;
    setModal(null);
    setGlobalLoading(true);
    try {
      await uploadFiles(files, category.label, subfolder);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleDirectUpload = async (files, category, subfolder) => {
    setGlobalLoading(true);
    try {
      await uploadFiles(files, category, subfolder);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}
    >
      {globalLoading && <LoadingOverlay />}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 0 3px #dcfce7",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                color: "#94a3b8",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              SAC Società Aeroporto Catania
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(22px, 5vw, 28px)",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 4px",
              letterSpacing: "-0.02em",
            }}
          >
            Caricamento File
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Trasferisci i file nelle rispettive cartelle
          </p>
        </div>

        {/* Grid — 1 colonna su mobile, 2 su desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "14px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <UploadZone
              key={cat.id}
              category={cat}
              onUpload={handleUpload}
              onDirectUpload={handleDirectUpload}
            />
          ))}
        </div>
      </div>

      {modal && (
        <SubfolderModal
          category={modal.category}
          files={modal.files}
          onClose={() => setModal(null)}
          onConfirm={handleConfirm}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
