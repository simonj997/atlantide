import Link from "next/link";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import ProgettoForm from "../../../../components/ProgettoForm";

export default async function ModificaProgettoPage({ params }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: progetto, error } = await supabase
    .from("progetti")
    .select("*")
    .eq("id_progetto", id)
    .single();

  if (error || !progetto) {
    return (
      <div className="page-head">
        <div>
          <h1>Progetto non trovato</h1>
          <div className="sub" style={{ color: "var(--risk)" }}>
            {error ? error.message : `Nessun progetto con codice ${id}.`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Modifica progetto — {progetto.id_progetto}</h1>
          <div className="sub">{progetto.descrizione}</div>
        </div>
        <Link href="/progetti" className="btn" style={{ background: "var(--panel-2)", color: "var(--text)" }}>
          ← Torna a Progetti
        </Link>
      </div>
      <ProgettoForm modalita="modifica" progetto={progetto} />
    </>
  );
}
