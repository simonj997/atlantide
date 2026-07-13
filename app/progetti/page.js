import { getProgettiConAllocazioni } from "../../lib/queries";
import { statoBadgeClass } from "../../lib/risk";

function formatData(valore) {
  if (!valore) return "—";
  return new Date(valore).toLocaleDateString("it-IT");
}

export default async function ProgettiPage() {
  let progetti = [];
  let errore = null;

  try {
    progetti = await getProgettiConAllocazioni();
  } catch (e) {
    errore = e.message || String(e);
  }

  if (errore) {
    return (
      <div className="page-head">
        <div>
          <h1>Progetti</h1>
          <div className="sub" style={{ color: "var(--risk)" }}>
            Errore nel caricamento: {errore}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Progetti</h1>
          <div className="sub">
            Tutti i progetti monitorati, con effort aggregato dalle allocazioni per risorsa
          </div>
        </div>
      </div>
      <div className="panel">
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 1200 }}>
            <thead>
              <tr>
                <th>Progetto</th>
                <th>Stato</th>
                <th>Richiedente</th>
                <th>Team assegnato</th>
                <th>Effort Tot. (gg)</th>
                <th>Quarter Desid.</th>
                <th>Quarter Pian.</th>
                <th>Due Date</th>
                <th>Go Live</th>
                <th>Rischio</th>
              </tr>
            </thead>
            <tbody>
              {progetti.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ color: "var(--muted)" }}>
                    Nessun progetto trovato.
                  </td>
                </tr>
              ) : (
                progetti.map((p) => (
                  <tr key={p.id_progetto}>
                    <td>
                      <div className="proj-id">{p.id_progetto}</div>
                      <div className="proj-title">{p.descrizione}</div>
                    </td>
                    <td>
                      <span className={`badge ${statoBadgeClass(p.stato)}`}>{p.stato}</span>
                    </td>
                    <td>{p.richiedente || "—"}</td>
                    <td>{p.team.length > 0 ? p.team.join("; ") : "—"}</td>
                    <td>{p.effortTot}</td>
                    <td>{p.quarter_desiderato || "—"}</td>
                    <td>{p.quarter_pianificato || "—"}</td>
                    <td>{formatData(p.due_date)}</td>
                    <td>{formatData(p.go_live_date)}</td>
                    <td>
                      <span className={`risk-pill ${p.risk.level}`}>
                        {p.risk.level === "risk" ? "⚠" : "✓"} {p.risk.label}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="footnote">
          &quot;Team assegnato&quot; ed &quot;Effort Tot.&quot; sono calcolati automaticamente dalla
          tabella Allocazioni (persona + ruolo + effort pianificato) — solo per lettura rapida.
        </div>
      </div>
    </>
  );
}
