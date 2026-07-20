"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CampoInput from "./CampoInput";
import { CAMPI_PROGETTO } from "../lib/campi";
import { creaProgetto, updateProgetto, eliminaProgetto } from "../lib/actions";

export default function ProgettoForm({ modalita, progetto }) {
  const router = useRouter();
  const iniziale = progetto || {};
  const [idProgetto, setIdProgetto] = useState(iniziale.id_progetto || "");
  const [valori, setValori] = useState(() => {
    const v = {};
    for (const c of CAMPI_PROGETTO) v[c.nome] = iniziale[c.nome];
    return v;
  });
  const [salvataggio, setSalvataggio] = useState(false);
  const [eliminazione, setEliminazione] = useState(false);
  const [errore, setErrore] = useState(null);

  function aggiorna(nome, valore) {
    setValori((prev) => ({ ...prev, [nome]: valore }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore(null);
    setSalvataggio(true);
    try {
      if (modalita === "crea") {
        await creaProgetto(idProgetto, valori);
      } else {
        await updateProgetto(iniziale.id_progetto, valori);
      }
    } catch (e2) {
      if (e2?.digest?.startsWith("NEXT_REDIRECT")) throw e2;
      setErrore(e2.message || String(e2));
      setSalvataggio(false);
    }
  }

  async function handleElimina() {
    if (!confirm(`Eliminare definitivamente il progetto ${iniziale.id_progetto}? L'operazione non è reversibile.`)) {
      return;
    }
    setErrore(null);
    setEliminazione(true);
    try {
      await eliminaProgetto(iniziale.id_progetto);
    } catch (e2) {
      if (e2?.digest?.startsWith("NEXT_REDIRECT")) throw e2;
      setErrore(e2.message || String(e2));
      setEliminazione(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="form-grid">
        {modalita === "crea" && (
          <div className="field field-wide">
            <label>Codice progetto *</label>
            <input
              type="text"
              required
              placeholder="es. AWP-3001"
              value={idProgetto}
              onChange={(e) => setIdProgetto(e.target.value)}
            />
          </div>
        )}
        {CAMPI_PROGETTO.map((campo) => (
          <div key={campo.nome} className={`field${campo.largo ? " field-wide" : ""}`}>
            <label htmlFor={campo.nome}>{campo.etichetta}</label>
            <CampoInput campo={campo} valore={valori[campo.nome]} onChange={(v) => aggiorna(campo.nome, v)} />
          </div>
        ))}
      </div>

      {errore && <div style={{ padding: "0 18px 14px", color: "var(--risk)", fontSize: 13 }}>{errore}</div>}

      <div className="form-actions" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn" disabled={salvataggio || eliminazione}>
            {salvataggio ? "Salvataggio..." : modalita === "crea" ? "Crea progetto" : "Salva modifiche"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.push("/progetti")}
            disabled={salvataggio || eliminazione}
          >
            Annulla
          </button>
        </div>
        {modalita === "modifica" && (
          <button
            type="button"
            onClick={handleElimina}
            disabled={salvataggio || eliminazione}
            style={{
              background: "var(--risk-bg)",
              color: "var(--risk)",
              border: "1px solid var(--risk)",
              fontWeight: 600,
              fontSize: 13,
              padding: "9px 16px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {eliminazione ? "Eliminazione..." : "Elimina progetto"}
          </button>
        )}
      </div>
    </form>
  );
}
