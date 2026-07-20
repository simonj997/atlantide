"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statoBadgeClass } from "../lib/risk";

function formatData(valore) {
  if (!valore) return "—";
  return new Date(valore).toLocaleDateString("it-IT");
}

function formatProdotto(prodotto) {
  if (!prodotto || prodotto.length === 0) return "—";
  return prodotto.join(", ");
}

export default function ProgettiTable({ progetti }) {
  const [areaSelezionata, setAreaSelezionata] = useState("Tutte");

  const aree = useMemo(() => {
    const insieme = new Set(progetti.map((p) => p.area).filter(Boolean));
    return ["Tutte", ...Array.from(insieme).sort()];
  }, [progetti]);

  const progettiFiltrati =
    areaSelezionata === "Tutte" ? progetti : progetti.filter((p) => p.area === areaSelezionata);

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Elenco progetti</h2>
        <select
          value={areaSelezionata}
          onChange={(e) => setAreaSelezionata(e.target.value)}
          style={{
            background: "var(--panel-2)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 13,
          }}
        >
          {aree.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ minWidth: 1900 }}>
          <thead>
            <tr>
              <th>Progetto</th>
              <th>Prodotto</th>
              <th>Stato</th>
              <th>Priorità</th>
              <th>Score</th>
              <th>Driver</th>
              <th>Owner</th>
              <th>Risorse</th>
              <th>Effort</th>
              <th>Quarter</th>
              <th>Due Date</th>
              <th>Go Live</th>
              <th>Pianificazione</th>
              <th>Tipo Ritardo</th>
              <th>Critico</th>
              <th>JIRA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {progettiFiltrati.length === 0 ? (
              <tr>
                <td colSpan={17} style={{ color: "var(--muted)" }}>
                  Nessun progetto trovato.
                </td>
              </tr>
            ) : (
              progettiFiltrati.map((p) => (
                <tr key={p.id_progetto}>
                  <td>
                    <div className="proj-id">{p.id_progetto}</div>
                    <div className="proj-title">{p.descrizione}</div>
                  </td>
                  <td>{formatProdotto(p.prodotto)}</td>
                  <td>
                    <span className={`badge ${statoBadgeClass(p.stato)}`}>{p.stato}</span>
                  </td>
                  <td>{p.priorita || "—"}</td>
                  <td>{p.score ?? "—"}</td>
                  <td>{p.driver || "—"}</td>
                  <td>{p.owner_progetto || "—"}</td>
                  <td>{p.risorse.length > 0 ? p.risorse.join(", ") : "—"}</td>
                  <td>{p.effort || "—"}</td>
                  <td>{p.quarter_pianificato || "—"}</td>
                  <td>{formatData(p.due_date)}</td>
                  <td>{formatData(p.go_live_date)}</td>
                  <td>
                    <span className={`risk-pill ${p.pianificazione.level}`}>
                      {p.pianificazione.label}
                    </span>
                  </td>
                  <td>
                    {p.tipoRitardo ? (
                      <span
                        className={`risk-pill ${
                          p.tipoRitardo === "Ritardo Critico" ? "risk" : "warn"
                        }`}
                      >
                        {p.tipoRitardo}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.critico_per_business ? <span className="risk-pill risk">⚠ Critico</span> : "—"}</td>
                  <td>{p.jira_code || "—"}</td>
                  <td>
                    <Link href={`/progetti/${p.id_progetto}`} style={{ color: "var(--accent)" }}>
                      Modifica
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="footnote">
        &quot;Risorse&quot; è calcolato automaticamente dalla tabella Allocazioni.
        &quot;Pianificazione&quot; e &quot;Tipo Ritardo&quot; sono calcolati dalle regole di
        business validate sul Masterplan originale.
      </div>
    </div>
  );
}
