"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Select con casella di ricerca: utile quando le opzioni sono troppe per
// scorrere comodamente un <select> nativo (es. centinaia di progetti).
export default function SearchableSelect({ options, value, onChange, placeholder = "Cerca..." }) {
  const [aperto, setAperto] = useState(false);
  const [testo, setTesto] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onClickFuori(e) {
      if (ref.current && !ref.current.contains(e.target)) setAperto(false);
    }
    document.addEventListener("mousedown", onClickFuori);
    return () => document.removeEventListener("mousedown", onClickFuori);
  }, []);

  const selezionata = options.find((o) => o.value === value);

  const filtrate = useMemo(() => {
    const t = testo.trim().toLowerCase();
    if (!t) return options;
    return options.filter((o) => o.label.toLowerCase().includes(t));
  }, [options, testo]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setAperto((v) => !v)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "8px 10px",
          borderRadius: 6,
          border: "1px solid var(--border)",
          background: "var(--panel-2)",
          color: selezionata ? "var(--text)" : "var(--muted)",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {selezionata ? selezionata.label : placeholder}
      </button>
      {aperto && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 30,
            marginTop: 4,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <input
            autoFocus
            type="text"
            placeholder="Digita per cercare..."
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "none",
              borderBottom: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text)",
              fontSize: 13,
              boxSizing: "border-box",
            }}
          />
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtrate.length === 0 ? (
              <div style={{ padding: "8px 10px", fontSize: 12.5, color: "var(--muted)" }}>
                Nessun risultato
              </div>
            ) : (
              filtrate.map((o) => (
                <div
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setTesto("");
                    setAperto(false);
                  }}
                  style={{
                    padding: "7px 10px",
                    fontSize: 13,
                    cursor: "pointer",
                    background: o.value === value ? "var(--panel-2)" : "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--panel-2)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = o.value === value ? "var(--panel-2)" : "transparent")
                  }
                >
                  {o.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
