// Valori di riferimento provvisori (non ancora collegati alla pagina "Regole").
export const CAPACITY_PER_PERSONA_GG = 50;
export const SOGLIA_CAPACITY_PERCENT = 85;

const STATO_BADGE = {
  "In Progress": "st-progress",
  Dev: "st-progress",
  QA: "st-qa",
  Test: "st-qa",
  UAT: "st-qa",
  "UAT Release": "st-qa",
  "Prod. Release": "st-qa",
  Stage: "st-stage",
  Live: "st-live",
  Done: "st-live",
  Design: "st-design",
  Definition: "st-design",
  Analysis: "st-design",
  "To Start": "st-design",
  "To Do": "st-design",
  "To Be Planned": "st-design",
  "More Info": "st-design",
  "On Hold": "st-hold",
  Cancelled: "st-cancelled",
};

export function statoBadgeClass(stato) {
  return STATO_BADGE[stato] || "st-design";
}

export function capacityBarClass(percent) {
  if (percent >= 100) return "over";
  if (percent >= SOGLIA_CAPACITY_PERCENT) return "near";
  return "under";
}
