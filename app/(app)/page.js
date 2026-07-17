import { getProgettiConAllocazioni, getAllocazioniPerPersona } from "../../lib/queries";
import { statoBadgeClass, CAPACITY_PER_PERSONA_GG } from "../../lib/risk";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();

  let progetti = [];
  let personeCapacity = [];
  let errore = null;

  try {
    [progetti, personeCapacity] = await Promise.all([
      getProgettiConAllocazioni(supabase),
      getAllocazioniPerPersona(supabase),
    ]);
  } catch (e) {
    errore = e.message || String(e);
  }

  if (errore) {
    return (
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="sub" style={{ color: "var(--risk)" }}>
            Errore nel caricamento dati: {errore}
          </div>
        </div>
      </div>
    );
  }

  const progettiAttivi = progetti.filter(
    (p) => p.stato !== "Done" && p.stato !== "Cancelled"
  );
  const progettiARischio = progetti.filter(
    (p) => p.pianificazione.level === "risk" || p.tipoRitardo === "Ritardo Critico"
  );
  const effortAllocatoTotale = progetti.reduce((somma, p) => somma + p.effortTot, 0);

  const capacityTotale = personeCapacity.length * CAPACITY_PER_PERSONA_GG;
  const pianificatoTotale = personeCapacity.reduce(
    (somma, p) => somma + p.totalePianificato,
    0
  );
  const capacityResiduaPercent =
    capacityTotale > 0
      ? Math.round(((capacityTotale - pianificatoTotale) / capacityTotale) * 100)
      : null;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">Panoramica generale dei progetti monitorati</div>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="label">Progetti attivi</div>
          <div className="value">{progettiAttivi.length}</div>
        </div>
        <div className="kpi">
          <div className="label">Progetti a rischio</div>
          <div className="value">{progettiARischio.length}</div>
        </div>
        <div className="kpi">
          <div className="label">Effort allocato (gg)</div>
          <div className="value">{effortAllocatoTotale}</div>
          <div className="delta">su {personeCapacity.length} risorse</div>
        </div>
        <div className="kpi">
          <div className="label">Capacity residua</div>
          <div className="value">
            {capacityResiduaPercent !== null ? `${capacityResiduaPercent}%` : "—"}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Progetti a rischio</h2>
          <span className="hint">
            {progettiARischio.length} di {progetti.length}
          </span>
        </div>
        {progettiARischio.length === 0 ? (
          <p style={{ padding: "16px 18px", color: "var(--muted)" }}>
            Nessun progetto a rischio al momento.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Progetto</th>
                <th>Stato</th>
                <th>Quarter</th>
                <th>Rischio</th>
              </tr>
            </thead>
            <tbody>
              {progettiARischio.map((p) => (
                <tr key={p.id_progetto}>
                  <td>
                    <div className="proj-id">{p.id_progetto}</div>
                    <div className="proj-title">{p.descrizione}</div>
                  </td>
                  <td>
                    <span className={`badge ${statoBadgeClass(p.stato)}`}>{p.stato}</span>
                  </td>
                  <td>{p.quarter_pianificato || "—"}</td>
                  <td>
                    <span className={`risk-pill ${p.pianificazione.level}`}>
                      {p.pianificazione.label}
                      {p.tipoRitardo === "Ritardo Critico" ? " — Ritardo Critico" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
