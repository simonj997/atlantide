import { getAllocazioniPerPersona } from "../../../lib/queries";
import { CAPACITY_PER_PERSONA_GG, SOGLIA_CAPACITY_PERCENT, capacityBarClass } from "../../../lib/risk";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export default async function CapacityPage() {
  const supabase = await createSupabaseServerClient();

  let persone = [];
  let errore = null;

  try {
    persone = await getAllocazioniPerPersona(supabase);
  } catch (e) {
    errore = e.message || String(e);
  }

  if (errore) {
    return (
      <div className="page-head">
        <div>
          <h1>Risorse &amp; Capacity</h1>
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
          <h1>Risorse &amp; Capacity</h1>
          <div className="sub">
            Effort pianificato vs. capacity di riferimento ({CAPACITY_PER_PERSONA_GG} gg/persona —
            valore provvisorio, regolabile in futuro)
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <h2>Capacity per risorsa</h2>
          <span className="hint">Soglia di allerta: {SOGLIA_CAPACITY_PERCENT}%</span>
        </div>
        {persone.length === 0 ? (
          <p style={{ padding: "16px 18px", color: "var(--muted)" }}>
            Nessuna allocazione trovata.
          </p>
        ) : (
          persone.map((p) => {
            const percent = Math.round((p.totalePianificato / CAPACITY_PER_PERSONA_GG) * 100);
            return (
              <div className="capacity-row" key={p.persona}>
                <div>
                  <div className="res-name">{p.persona}</div>
                  <div className="res-role">{p.ruoli || "—"}</div>
                </div>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${capacityBarClass(percent)}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>
                <div className="cap-value">
                  {p.totalePianificato} / {CAPACITY_PER_PERSONA_GG} gg
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
