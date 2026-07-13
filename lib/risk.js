// Valori di riferimento provvisori (non ancora collegati alla pagina "Regole").
export const CAPACITY_PER_PERSONA_GG = 50;
export const SOGLIA_CAPACITY_PERCENT = 85;

const STATO_BADGE = {
  "In Progress": "st-progress",
  QA: "st-qa",
  Stage: "st-stage",
  Live: "st-live",
  Design: "st-design",
};

export function statoBadgeClass(stato) {
  return STATO_BADGE[stato] || "st-design";
}

export function computeRisk(progetto) {
  if (!progetto.quarter_pianificato) {
    return { level: "risk", label: "Manca quarter pianificato" };
  }

  if (progetto.due_date) {
    const oggi = new Date();
    const scadenza = new Date(progetto.due_date);
    const concluso = progetto.stato === "Live" || progetto.stato === "Completato";
    if (scadenza < oggi && !concluso) {
      return { level: "risk", label: "Due date scaduta" };
    }
  }

  return { level: "ok", label: "Nessun rischio rilevato" };
}

export function capacityBarClass(percent) {
  if (percent >= 100) return "over";
  if (percent >= SOGLIA_CAPACITY_PERCENT) return "near";
  return "under";
}
