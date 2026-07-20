import Link from "next/link";
import ProgettoForm from "../../../../components/ProgettoForm";

export default function NuovoProgettoPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Nuovo progetto</h1>
          <div className="sub">Censimento manuale — compila i campi che conosci, gli altri restano vuoti</div>
        </div>
        <Link href="/progetti" className="btn" style={{ background: "var(--panel-2)", color: "var(--text)" }}>
          ← Torna a Progetti
        </Link>
      </div>
      <ProgettoForm modalita="crea" />
    </>
  );
}
