"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProgetto } from "../lib/actions";
import {
  EFFORT_BUCKETS,
  DRIVER_OPTIONS,
  STATO_OPTIONS,
  PRIORITA_OPTIONS,
  FONTE_OPTIONS,
} from "../lib/regole";

function perInputDate(valore) {
  if (!valore) return "";
  return String(valore).slice(0, 10);
}

export default function EditProgettoForm({ progetto }) {
  const router = useRouter();
  const [salvataggio, setSalvataggio] = useState(false);
  const [errore, setErrore] = useState(null);

  async function handleSubmit(formData) {
    setErrore(null);
    setSalvataggio(true);
    try {
      await updateProgetto(progetto.id_progetto, formData);
    } catch (e) {
      // redirect() lancia un'eccezione speciale di Next.js: non è un errore vero
      if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
      setErrore(e.message || String(e));
      setSalvataggio(false);
    }
  }

  return (
    <form action={handleSubmit} className="panel">
      <div className="form-grid">
        <div className="field">
          <label>Area</label>
          <input type="text" name="area" defaultValue={progetto.area || ""} />
        </div>
        <div className="field">
          <label>Prodotto (separati da virgola)</label>
          <input
            type="text"
            name="prodotto"
            defaultValue={(progetto.prodotto || []).join(", ")}
          />
        </div>
        <div className="field">
          <label>Macro Attività</label>
          <input type="text" name="macro_attivita" defaultValue={progetto.macro_attivita || ""} />
        </div>

        <div className="field field-wide">
          <label>Descrizione / Attività</label>
          <input type="text" name="descrizione" defaultValue={progetto.descrizione || ""} />
        </div>

        <div className="field">
          <label>Stato</label>
          <select name="stato" defaultValue={progetto.stato || ""}>
            <option value="">—</option>
            {STATO_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Priorità</label>
          <select name="priorita" defaultValue={progetto.priorita || ""}>
            <option value="">—</option>
            {PRIORITA_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Score (1-5)</label>
          <input type="number" name="score" min="1" max="5" defaultValue={progetto.score ?? ""} />
        </div>

        <div className="field">
          <label>Driver</label>
          <select name="driver" defaultValue={progetto.driver || ""}>
            <option value="">—</option>
            {DRIVER_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Effort</label>
          <select name="effort" defaultValue={progetto.effort || ""}>
            <option value="">—</option>
            {EFFORT_BUCKETS.map((b) => (
              <option key={b.valore} value={b.valore}>
                {b.valore} gg — {b.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field field-checkbox">
          <input
            type="checkbox"
            id="critico_per_business"
            name="critico_per_business"
            defaultChecked={!!progetto.critico_per_business}
          />
          <label htmlFor="critico_per_business" style={{ margin: 0 }}>
            Critico per Business
          </label>
        </div>

        <div className="field">
          <label>Owner Progetto</label>
          <input type="text" name="owner_progetto" defaultValue={progetto.owner_progetto || ""} />
        </div>
        <div className="field">
          <label>Referenti</label>
          <input type="text" name="referenti" defaultValue={progetto.referenti || ""} />
        </div>
        <div className="field">
          <label>Action Owner</label>
          <input type="text" name="action_owner" defaultValue={progetto.action_owner || ""} />
        </div>

        <div className="field">
          <label>Fonte</label>
          <select name="fonte" defaultValue={progetto.fonte || "Manuale"}>
            {FONTE_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Codice JIRA</label>
          <input type="text" name="jira_code" defaultValue={progetto.jira_code || ""} />
        </div>
        <div className="field">
          <label>Link esterno (Jira/DevOps)</label>
          <input type="url" name="link_esterno" defaultValue={progetto.link_esterno || ""} />
        </div>

        <div className="field">
          <label>Quarter Pianificato</label>
          <input
            type="text"
            name="quarter_pianificato"
            placeholder="es. 2026 Q3"
            defaultValue={progetto.quarter_pianificato || ""}
          />
        </div>
        <div className="field">
          <label>Due Date</label>
          <input type="date" name="due_date" defaultValue={perInputDate(progetto.due_date)} />
        </div>
        <div className="field">
          <label>Due Date Ripianificata</label>
          <input
            type="date"
            name="due_date_ripianificata"
            defaultValue={perInputDate(progetto.due_date_ripianificata)}
          />
        </div>

        <div className="field">
          <label>Deadline Chiusura</label>
          <input
            type="date"
            name="deadline_chiusura"
            defaultValue={perInputDate(progetto.deadline_chiusura)}
          />
        </div>
        <div className="field">
          <label>Go Live</label>
          <input type="date" name="go_live_date" defaultValue={perInputDate(progetto.go_live_date)} />
        </div>

        <div className="field field-wide">
          <label>Last Action</label>
          <textarea name="last_action" defaultValue={progetto.last_action || ""} />
        </div>
        <div className="field field-wide">
          <label>To Do</label>
          <textarea name="to_do" defaultValue={progetto.to_do || ""} />
        </div>
        <div className="field field-wide">
          <label>Note</label>
          <textarea name="note" defaultValue={progetto.note || ""} />
        </div>
      </div>

      {errore && (
        <div style={{ padding: "0 18px 14px", color: "var(--risk)", fontSize: 13 }}>{errore}</div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn" disabled={salvataggio}>
          {salvataggio ? "Salvataggio..." : "Salva modifiche"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.push("/progetti")}
          disabled={salvataggio}
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
