"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchableSelect from "./SearchableSelect";
import { creaAllocazione, eliminaAllocazione, updateAllocazione } from "../lib/actions";

const numeroInputStyle = {
  width: 70,
  padding: "5px 7px",
  borderRadius: 5,
  border: "1px solid var(--border)",
  background: "var(--panel-2)",
  color: "var(--text)",
  fontSize: 12.5,
  fontFamily: "inherit",
};

export default function AllocazioniManager({ progettiOpzioni, risorseOpzioni, allocazioni }) {
  const router = useRouter();
  const [progettoScelto, setProgettoScelto] = useState("");
  const [risorsaScelta, setRisorsaScelta] = useState("");
  const [ruolo, setRuolo] = useState("");
  const [effortPianificato, setEffortPianificato] = useState("");
  const [effortEffettivo, setEffortEffettivo] = useState("");
  const [salvataggio, setSalvataggio] = useState(false);
  const [eliminando, setEliminando] = useState({});
  const [errore, setErrore] = useState(null);
  const [valoriRiga, setValoriRiga] = useState({});

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
      effort_pianificato: effortPianificato,
      effort_effettivo: effortEffettivo,
    });
    setSalvataggio(false);
    if (risultato.errore) {
      setErrore(risultato.errore);
      return;
    }
    setProgettoScelto("");
    setRisorsaScelta("");
    setRuolo("");
    setEffortPianificato("");
    setEffortEffettivo("");
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

  function valoreRiga(id, campo, originale) {
    return valoriRiga[id]?.[campo] ?? originale ?? "";
  }

  function impostaValoreRiga(id, campo, valore) {
    setValoriRiga((prev) => ({ ...prev, [id]: { ...prev[id], [campo]: valore } }));
  }

  async function salvaCampoRiga(id, campo, valoreOriginale) {
    const nuovo = valoriRiga[id]?.[campo];
    if (nuovo === undefined || String(nuovo) === String(valoreOriginale ?? "")) return;
    const risultato = await updateAllocazione(id, { [campo]: nuovo });
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
          gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr auto",
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
        <div className="field">
          <label>Effort Pian. (gg)</label>
          <input
            type="number"
            value={effortPianificato}
            onChange={(e) => setEffortPianificato(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Effort Eff. (gg)</label>
          <input
            type="number"
            value={effortEffettivo}
            onChange={(e) => setEffortEffettivo(e.target.value)}
          />
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
                  <td>
                    <input
                      type="text"
                      value={valoreRiga(a.id, "ruolo", a.ruolo)}
                      onChange={(e) => impostaValoreRiga(a.id, "ruolo", e.target.value)}
                      onBlur={() => salvaCampoRiga(a.id, "ruolo", a.ruolo)}
                      style={{ ...numeroInputStyle, width: 130 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={valoreRiga(a.id, "effort_pianificato", a.effort_pianificato)}
                      onChange={(e) => impostaValoreRiga(a.id, "effort_pianificato", e.target.value)}
                      onBlur={() => salvaCampoRiga(a.id, "effort_pianificato", a.effort_pianificato)}
                      style={numeroInputStyle}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={valoreRiga(a.id, "effort_effettivo", a.effort_effettivo)}
                      onChange={(e) => impostaValoreRiga(a.id, "effort_effettivo", e.target.value)}
                      onBlur={() => salvaCampoRiga(a.id, "effort_effettivo", a.effort_effettivo)}
                      style={numeroInputStyle}
                    />
                  </td>
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
      <div className="footnote">
        Ruolo ed Effort si salvano automaticamente appena esci dal campo (clicca altrove dopo aver
        scritto).
      </div>
    </div>
  );
}
