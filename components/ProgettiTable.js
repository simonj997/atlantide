"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { statoBadgeClass } from "../lib/risk";
import { updateProgettoInline } from "../lib/actions";
import { EFFORT_BUCKETS, DRIVER_OPTIONS, STATO_OPTIONS, PRIORITA_OPTIONS } from "../lib/regole";

function formatData(valore) {
  if (!valore) return "—";
  return new Date(valore).toLocaleDateString("it-IT");
}

function perInputDate(valore) {
  if (!valore) return "";
  return String(valore).slice(0, 10);
}

function formatProdotto(prodotto) {
  if (!prodotto || prodotto.length === 0) return "—";
  return prodotto.join(", ");
}

const inputStyle = {
  width: "100%",
  minWidth: 90,
  padding: "5px 7px",
  borderRadius: 5,
  border: "1px solid var(--border)",
  background: "var(--panel-2)",
  color: "var(--text)",
  fontSize: 12.5,
  fontFamily: "inherit",
};

export default function ProgettiTable({ progetti }) {
  const router = useRouter();
  const [areaSelezionata, setAreaSelezionata] = useState("Tutte");
  const [modificaAttiva, setModificaAttiva] = useState(false);
  const [modifiche, setModifiche] = useState({});
  const [salvando, setSalvando] = useState({});
  const [filtri, setFiltri] = useState({
    testo: "",
    prodotto: "",
    stato: "",
    priorita: "",
    owner: "",
    driver: "",
  });

  const aree = useMemo(() => {
    const insieme = new Set(progetti.map((p) => p.area).filter(Boolean));
    return ["Tutte", ...Array.from(insieme).sort()];
  }, [progetti]);

  const suggerimenti = useMemo(() => {
    const prodotto = new Set();
    const owner = new Set();
    progetti.forEach((p) => {
      (p.prodotto || []).forEach((v) => prodotto.add(v));
      if (p.owner_progetto) owner.add(p.owner_progetto);
    });
    return {
      prodotto: Array.from(prodotto).sort(),
      owner: Array.from(owner).sort(),
    };
  }, [progetti]);

  const progettiFiltrati = useMemo(() => {
    const testo = filtri.testo.trim().toLowerCase();
    const prodotto = filtri.prodotto.trim().toLowerCase();
    const stato = filtri.stato.trim().toLowerCase();
    const priorita = filtri.priorita.trim().toLowerCase();
    const owner = filtri.owner.trim().toLowerCase();
    const driver = filtri.driver.trim().toLowerCase();

    return progetti.filter((p) => {
      if (areaSelezionata !== "Tutte" && p.area !== areaSelezionata) return false;
      if (
        testo &&
        !`${p.id_progetto} ${p.descrizione || ""}`.toLowerCase().includes(testo)
      )
        return false;
      if (prodotto && !(p.prodotto || []).join(", ").toLowerCase().includes(prodotto))
        return false;
      if (stato && !(p.stato || "").toLowerCase().includes(stato)) return false;
      if (priorita && !(p.priorita || "").toLowerCase().includes(priorita)) return false;
      if (owner && !(p.owner_progetto || "").toLowerCase().includes(owner)) return false;
      if (driver && !(p.driver || "").toLowerCase().includes(driver)) return false;
      return true;
    });
  }, [progetti, areaSelezionata, filtri]);

  function aggiornaFiltro(campo, valore) {
    setFiltri((prev) => ({ ...prev, [campo]: valore }));
  }

  function aggiornaModifica(idProgetto, campo, valore) {
    setModifiche((prev) => ({
      ...prev,
      [idProgetto]: { ...prev[idProgetto], [campo]: valore },
    }));
  }

  async function salvaRiga(idProgetto) {
    const campi = modifiche[idProgetto];
    if (!campi) return;
    setSalvando((prev) => ({ ...prev, [idProgetto]: true }));
    const risultato = await updateProgettoInline(idProgetto, campi);
    setSalvando((prev) => ({ ...prev, [idProgetto]: false }));
    if (risultato.errore) {
      alert("Errore nel salvataggio di " + idProgetto + ": " + risultato.errore);
      return;
    }
    setModifiche((prev) => {
      const copia = { ...prev };
      delete copia[idProgetto];
      return copia;
    });
    router.refresh();
  }

  const filterInputStyle = {
    ...inputStyle,
    fontSize: 11.5,
    padding: "4px 6px",
    background: "var(--bg)",
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Elenco progetti</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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
          <button
            type="button"
            className={modificaAttiva ? "btn" : "btn-secondary"}
            onClick={() => setModificaAttiva((v) => !v)}
          >
            {modificaAttiva ? "✓ Modifica attiva" : "✎ Modifica tabella"}
          </button>
        </div>
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
            <tr>
              <th>
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={filtri.testo}
                  onChange={(e) => aggiornaFiltro("testo", e.target.value)}
                  style={filterInputStyle}
                />
              </th>
              <th>
                <input
                  type="text"
                  list="filtro-prodotto"
                  placeholder="Filtra..."
                  value={filtri.prodotto}
                  onChange={(e) => aggiornaFiltro("prodotto", e.target.value)}
                  style={filterInputStyle}
                />
                <datalist id="filtro-prodotto">
                  {suggerimenti.prodotto.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </th>
              <th>
                <input
                  type="text"
                  list="filtro-stato"
                  placeholder="Filtra..."
                  value={filtri.stato}
                  onChange={(e) => aggiornaFiltro("stato", e.target.value)}
                  style={filterInputStyle}
                />
                <datalist id="filtro-stato">
                  {STATO_OPTIONS.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </th>
              <th>
                <input
                  type="text"
                  list="filtro-priorita"
                  placeholder="Filtra..."
                  value={filtri.priorita}
                  onChange={(e) => aggiornaFiltro("priorita", e.target.value)}
                  style={filterInputStyle}
                />
                <datalist id="filtro-priorita">
                  {PRIORITA_OPTIONS.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </th>
              <th></th>
              <th>
                <input
                  type="text"
                  list="filtro-driver"
                  placeholder="Filtra..."
                  value={filtri.driver}
                  onChange={(e) => aggiornaFiltro("driver", e.target.value)}
                  style={filterInputStyle}
                />
                <datalist id="filtro-driver">
                  {DRIVER_OPTIONS.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </th>
              <th>
                <input
                  type="text"
                  list="filtro-owner"
                  placeholder="Filtra..."
                  value={filtri.owner}
                  onChange={(e) => aggiornaFiltro("owner", e.target.value)}
                  style={filterInputStyle}
                />
                <datalist id="filtro-owner">
                  {suggerimenti.owner.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </th>
              <th colSpan={9}></th>
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
              progettiFiltrati.map((p) => {
                const m = modifiche[p.id_progetto] || {};
                const valore = (campo) => (campo in m ? m[campo] : p[campo]);
                const modificato = !!modifiche[p.id_progetto];
                const inSalvataggio = !!salvando[p.id_progetto];

                return (
                  <tr key={p.id_progetto}>
                    <td>
                      <div className="proj-id">{p.id_progetto}</div>
                      <div className="proj-title">{p.descrizione}</div>
                    </td>
                    <td>{formatProdotto(p.prodotto)}</td>
                    <td>
                      {modificaAttiva ? (
                        <select
                          value={valore("stato") || ""}
                          onChange={(e) => aggiornaModifica(p.id_progetto, "stato", e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">—</option>
                          {STATO_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`badge ${statoBadgeClass(p.stato)}`}>{p.stato}</span>
                      )}
                    </td>
                    <td>
                      {modificaAttiva ? (
                        <select
                          value={valore("priorita") || ""}
                          onChange={(e) =>
                            aggiornaModifica(p.id_progetto, "priorita", e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="">—</option>
                          {PRIORITA_OPTIONS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        p.priorita || "—"
                      )}
                    </td>
                    <td>
                      {modificaAttiva ? (
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={valore("score") ?? ""}
                          onChange={(e) => aggiornaModifica(p.id_progetto, "score", e.target.value)}
                          style={inputStyle}
                        />
                      ) : (
                        p.score ?? "—"
                      )}
                    </td>
                    <td>
                      {modificaAttiva ? (
                        <select
                          value={valore("driver") || ""}
                          onChange={(e) => aggiornaModifica(p.id_progetto, "driver", e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">—</option>
                          {DRIVER_OPTIONS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        p.driver || "—"
                      )}
                    </td>
                    <td>
                      {modificaAttiva ? (
                        <input
                          type="text"
                          value={valore("owner_progetto") || ""}
                          onChange={(e) =>
                            aggiornaModifica(p.id_progetto, "owner_progetto", e.target.value)
                          }
                          style={inputStyle}
                        />
                      ) : (
                        p.owner_progetto || "—"
                      )}
                    </td>
                    <td>{p.risorse.length > 0 ? p.risorse.join(", ") : "—"}</td>
                    <td>
                      {modificaAttiva ? (
                        <select
                          value={valore("effort") || ""}
                          onChange={(e) => aggiornaModifica(p.id_progetto, "effort", e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">—</option>
                          {EFFORT_BUCKETS.map((b) => (
                            <option key={b.valore} value={b.valore}>
                              {b.valore}
                            </option>
                          ))}
                        </select>
                      ) : (
                        p.effort || "—"
                      )}
                    </td>
                    <td>
                      {modificaAttiva ? (
                        <input
                          type="text"
                          value={valore("quarter_pianificato") || ""}
                          onChange={(e) =>
                            aggiornaModifica(p.id_progetto, "quarter_pianificato", e.target.value)
                          }
                          style={inputStyle}
                        />
                      ) : (
                        p.quarter_pianificato || "—"
                      )}
                    </td>
                    <td>
                      {modificaAttiva ? (
                        <input
                          type="date"
                          value={perInputDate(valore("due_date"))}
                          onChange={(e) =>
                            aggiornaModifica(p.id_progetto, "due_date", e.target.value)
                          }
                          style={inputStyle}
                        />
                      ) : (
                        formatData(p.due_date)
                      )}
                    </td>
                    <td>
                      {modificaAttiva ? (
                        <input
                          type="date"
                          value={perInputDate(valore("go_live_date"))}
                          onChange={(e) =>
                            aggiornaModifica(p.id_progetto, "go_live_date", e.target.value)
                          }
                          style={inputStyle}
                        />
                      ) : (
                        formatData(p.go_live_date)
                      )}
                    </td>
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
                    <td>
                      {modificaAttiva ? (
                        <input
                          type="checkbox"
                          checked={!!valore("critico_per_business")}
                          onChange={(e) =>
                            aggiornaModifica(p.id_progetto, "critico_per_business", e.target.checked)
                          }
                        />
                      ) : p.critico_per_business ? (
                        <span className="risk-pill risk">⚠ Critico</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{p.jira_code || "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {modificaAttiva && modificato ? (
                        <button
                          type="button"
                          className="btn"
                          disabled={inSalvataggio}
                          onClick={() => salvaRiga(p.id_progetto)}
                          style={{ padding: "5px 10px", fontSize: 12 }}
                        >
                          {inSalvataggio ? "..." : "Salva"}
                        </button>
                      ) : (
                        <Link href={`/progetti/${p.id_progetto}`} style={{ color: "var(--accent)" }}>
                          Modifica
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="footnote">
        &quot;Risorse&quot; è calcolato automaticamente dalla tabella Allocazioni.
        &quot;Pianificazione&quot; e &quot;Tipo Ritardo&quot; sono calcolati dalle regole di
        business validate sul Masterplan originale. Con &quot;Modifica tabella&quot; attiva, i
        campi principali diventano modificabili direttamente in riga.
      </div>
    </div>
  );
}
