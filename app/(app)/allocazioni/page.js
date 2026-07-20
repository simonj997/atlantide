import { getDatiAllocazioniManager } from "../../../lib/queries";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import AllocazioniManager from "../../../components/AllocazioniManager";

export default async function AllocazioniPage() {
  const supabase = await createSupabaseServerClient();

  let dati = { progettiOpzioni: [], risorseOpzioni: [], allocazioni: [] };
  let errore = null;

  try {
    dati = await getDatiAllocazioniManager(supabase);
  } catch (e) {
    errore = e.message || String(e);
  }

  if (errore) {
    return (
      <div className="page-head">
        <div>
          <h1>Allocazioni</h1>
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
          <h1>Allocazioni</h1>
          <div className="sub">Chi lavora su quale progetto, e quanto effort</div>
        </div>
      </div>
      <AllocazioniManager
        progettiOpzioni={dati.progettiOpzioni}
        risorseOpzioni={dati.risorseOpzioni}
        allocazioni={dati.allocazioni}
      />
    </>
  );
}
