import Link from "next/link";
import { getProgettiConAllocazioni } from "../../../lib/queries";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import ProgettiTable from "../../../components/ProgettiTable";

export default async function ProgettiPage() {
  const supabase = await createSupabaseServerClient();

  let progetti = [];
  let errore = null;

  try {
    progetti = await getProgettiConAllocazioni(supabase);
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
        <Link href="/progetti/nuovo" className="btn">
          + Nuovo progetto
        </Link>
      </div>
      <ProgettiTable progetti={progetti} />
    </>
  );
}
