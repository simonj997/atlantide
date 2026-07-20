"use client";

import { useEffect, useRef, useState } from "react";

export default function MultiSelectFilter({ options, selected, onChange, placeholder = "Filtra..." }) {
  const [aperto, setAperto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickFuori(e) {
      if (ref.current && !ref.current.contains(e.target)) setAperto(false);
    }
    document.addEventListener("mousedown", onClickFuori);
    return () => document.removeEventListener("mousedown", onClickFuori);
  }, []);

  function toggleValore(valore) {
    if (selected.includes(valore)) {
      onChange(selected.filter((v) => v !== valore));
    } else {
      onChange([...selected, valore]);
    }
  }

  const etichetta =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selezionati`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setAperto((v) => !v)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "4px 6px",
          borderRadius: 5,
          border: "1px solid var(--border)",
          background: "var(--bg)",
          color: selected.length ? "var(--text)" : "var(--muted)",
          fontSize: 11.5,
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        {etichetta}
      </button>
      {aperto && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 20,
            marginTop: 4,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: 6,
            minWidth: 190,
            maxHeight: 260,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {selected.length > 0 && (
            <div
              onClick={() => onChange([])}
              style={{
                fontSize: 11,
                color: "var(--accent)",
                cursor: "pointer",
                padding: "4px 6px",
                marginBottom: 2,
              }}
            >
              Cancella selezione
            </div>
          )}
          {options.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--muted)", padding: "4px 6px" }}>
              Nessuna opzione
            </div>
          ) : (
            options.map((opt) => (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 6px",
                  fontSize: 12.5,
                  cursor: "pointer",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggleValore(opt)} />
                {opt}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}
