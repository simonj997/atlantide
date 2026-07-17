// Regole di calcolo del Masterplan, tradotte e validate dalle formule reali
// del file Excel originale (foglio "Master", V16) — vedi confronto riga per
// riga eseguito durante la migrazione.

// --- Regola 1: Effort (bucket) -> Valore ---
// Sostituisce la vecchia tabella Effort/Valore/Media GG del masterplan
// originale con i nuovi scaglioni definiti da Simone. "Media GG" non viene
// più calcolata (decisione esplicita: non è un dato affidabile per la
// pianificazione).
export const EFFORT_BUCKETS = [
  { valore: "0-5", label: "Lavorabile in una settimana", score: 1 },
  { valore: "6-10", label: "Lavorabile in due settimane", score: 2 },
  { valore: "11-20", label: "Lavorabile in un mese", score: 3 },
  { valore: "21-60", label: "Lavorabile in un Quarter", score: 4 },
  { valore: "61-100", label: "Lavorabile in due Quarter", score: 5 },
  { valore: "100+", label: "Lavorabile su più Quarter (progetto esteso)", score: 6 },
];

export function effortToValore(bucket) {
  const trovato = EFFORT_BUCKETS.find((b) => b.valore === bucket);
  return trovato ? trovato.score : null;
}

// --- Regola 2a: Pianificazione rispetto a deadline Originale ---
// a = deadline (Deadline originale)
// b = deadlineRipianificata (ultima data di rischedulazione, già pulita)
export function calcolaPianificazione(stato, deadline, deadlineRipianificata) {
  const statoStr = stato || "";
  if (statoStr.includes("Cancelled")) return "CANCELLATO";
  if (statoStr.includes("Done")) return "CHIUSO";

  const a = deadline ? new Date(deadline) : null;
  const b = deadlineRipianificata ? new Date(deadlineRipianificata) : null;
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);

  const aTBD = deadline === "TBD";
  const bVuota = !deadlineRipianificata;
  const bTBD = deadlineRipianificata === "TBD";

  if (aTBD) {
    return bVuota ? "Da Pianificare" : "";
  }
  if (a && a < oggi && bVuota) return "Da Ripianificare";
  if (a && a >= oggi && bVuota) return "Pianificato";
  if (bTBD) return "Da Ripianificare";
  if (b && b < oggi && !bVuota) return "Da Ripianificare";
  if (a && b && a < b && b >= oggi) return "Ripianificato Post";
  if (a && b && a > b && b >= oggi) return "Ripianificato Ant";
  return "";
}

// --- Regola 2b: Pianificazione per item in stato CHIUSO ---
// Confronta la data di chiusura effettiva (goLive) con il riferimento
// pianificato: la Deadline Ripianificata se presente, altrimenti la
// Deadline originale. A differenza della formula Excel originale (che in
// un ramo usava per errore un valore intermedio non ripulito), qui si usa
// sempre il dato "pulito".
export function calcolaPianificazioneChiusura(deadlineRipianificata, deadline, goLive) {
  const riferimento = deadlineRipianificata || deadline;
  if (!riferimento || !goLive) return "";

  const rif = new Date(riferimento);
  const gl = new Date(goLive);

  if (gl.getTime() === rif.getTime()) return "In Linea";
  if (gl > rif) return "In Ritardo";
  return "In Anticipo";
}

const PIANIFICAZIONE_LEVEL = {
  "In Linea": "ok",
  "In Anticipo": "ok",
  Pianificato: "ok",
  "Ripianificato Ant": "ok",
  "Da Pianificare": "warn",
  "Ripianificato Post": "warn",
  "In Ritardo": "risk",
  "Da Ripianificare": "risk",
  CANCELLATO: "ok",
};

// Combina AY e AZ in un unico stato leggibile: per i progetti chiusi mostra
// l'esito reale (In Linea/In Ritardo/In Anticipo), per gli altri lo stato
// di pianificazione corrente.
export function statoPianificazione(progetto) {
  const { stato, due_date, due_date_ripianificata, go_live_date } = progetto;
  const base = calcolaPianificazione(stato, due_date, due_date_ripianificata);

  const label =
    base === "CHIUSO"
      ? calcolaPianificazioneChiusura(due_date_ripianificata, due_date, go_live_date) || "CHIUSO"
      : base;

  const level = PIANIFICAZIONE_LEVEL[label] || (label ? "warn" : null);
  return { label: label || "Non determinato", level: level || "warn" };
}

// --- Regola 2c: Tipo Ritardo ---
// Soglia di 15 giorni (corrisponde a BF1 nel file originale).
export function calcolaTipoRitardo(deadline, goLive, soglia = 15) {
  if (!goLive || !deadline) return "";

  const a = new Date(deadline);
  const c = new Date(goLive);

  if (c > a) {
    const giorni = Math.round((c - a) / (1000 * 60 * 60 * 24));
    return giorni > soglia ? "Ritardo Critico" : "Ritardo Lieve";
  }
  if (c < a) return "in anticipo Rispetto a Pianificazione Originale";
  return "";
}
