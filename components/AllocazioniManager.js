"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchableSelect from "./SearchableSelect";
import { creaAllocazione, eliminaAllocazione } from "../lib/actions";

export default function AllocazioniManager({ progettiOpzioni, risorseOpzioni, allocazioni }) {
  const router = useRouter();
  const [progettoScelto, setProgettoScelto] = useState("");
  const [risorsaScelta, setRisorsaScelta] = useState("");
  const [ruolo, setRuolo] = useState("");
  const [salvataggio, setSalvataggio] = useState(false);
  const [eliminando, setEliminando] = useState({});
  const [errore, setErrore] = useState(null);

  async function handleAggiungi(e) {
    e.preventDefault();
    setErrore(null);
    if (!progettoScelto || !risorsaScelta) {
      setErrore("Seleziona sia il progetto sia la risorsa.");
      return;
    }
    const [nome, cognome] = risorsaScelta.split("|");
    setSalvataggio(true);
    const risultato = await creaAllocazione({
      id_progetto: progettoScelto,
      nome,
      cognome,
      ruolo,
    });
    setSalvataggio(false);
    if (risultato.errore) {
      setErrore(risultato.errore);
      return;
    }
    setProgettoScelto("");
    setRisorsaScelta("");
    setRuolo("");
    router.refresh();
  }

  async function handleElimina(id) {
    if (!confirm("Rimuovere questa allocazione?")) return;
    setEliminando((prev) => ({ ...prev, [id]: true }));
    const risultato = await eliminaAllocazione(id);
    setEliminando((prev) => ({ ...prev, [id]: false }));
    if (risultato.errore) {
      alert("Errore: " + risultato.errore);
      return;
    }
    router.refresh();
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Allocazioni</h2>
        <span className="hint">{allocazioni.length} righe</span>
      </div>

      <form
        onSubmit={handleAggiungi}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr auto",
          gap: 10,
          padding: 18,
          borderBottom: "1px solid var(--border)",
          alignItems: "end",
        }}
      >
        <div className="field">
          <label>Progetto</label>
          <SearchableSelect
            options={progettiOpzioni}
            value={progettoScelto}
            onChange={setProgettoScelto}
            placeholder="Cerca progetto..."
          />
        </div>
        <div className="field">
          <label>Risorsa</label>
          <SearchableSelect
            options={risorseOpzioni}
            value={risorsaScelta}
            onChange={setRisorsaScelta}
            placeholder="Cerca risorsa..."
          />
        </div>
        <div className="field">
          <label>Ruolo (opzionale)</label>
          <input type="text" value={ruolo} onChange={(e) => setRuolo(e.target.value)} />
        </div>
        <button type="submit" className="btn" disabled={salvataggio}>
          {salvataggio ? "..." : "+ Aggiungi"}
        </button>
      </form>

      {errore && <div style={{ padding: "0 18px 14px", color: "var(--risk)", fontSize: 13 }}>{errore}</div>}

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Progetto</th>
              <th>Risorsa</th>
              <th>Ruolo</th>
              <th>Effort Pian.</th>
              <th>Effort Eff.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allocazioni.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ color: "var(--muted)" }}>
                  Nessuna allocazione.
                </td>
              </tr>
            ) : (
              allocazioni.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="proj-id">{a.id_progetto}</div>
                    <div className="proj-title">{a.descrizioneProgetto}</div>
                  </td>
                  <td>
                    {a.nome} {a.cognome}
                  </td>
                  <td>{a.ruolo || "—"}</td>
                  <td>{a.effort_pianificato ?? "—"}</td>
                  <td>{a.effort_effettivo ?? "—"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleElimina(a.id)}
                      disabled={!!eliminando[a.id]}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--risk)",
                        cursor: "pointer",
                        fontSize: 12.5,
                      }}
                    >
                      {eliminando[a.id] ? "..." : "Rimuovi"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
