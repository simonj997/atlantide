// Unica fonte di verità per i campi del progetto: tipo di input, etichetta
// ed eventuali opzioni. Usata sia dal form di creazione sia da quello di
// modifica, così restano sempre coerenti.

import {
  EFFORT_BUCKETS,
  DRIVER_OPTIONS,
  STATO_OPTIONS,
  PRIORITA_OPTIONS,
  FONTE_OPTIONS,
} from "./regole";

export const CAMPI_PROGETTO = [
  { nome: "area", etichetta: "Area", tipo: "testo" },
  { nome: "prodotto", etichetta: "Prodotto (separati da virgola)", tipo: "testo-multiplo" },
  { nome: "macro_attivita", etichetta: "Macro Attività", tipo: "testo" },
  { nome: "descrizione", etichetta: "Descrizione / Attività", tipo: "testo", largo: true },
  { nome: "stato", etichetta: "Stato", tipo: "select", opzioni: STATO_OPTIONS },
  { nome: "priorita", etichetta: "Priorità", tipo: "select", opzioni: PRIORITA_OPTIONS },
  { nome: "score", etichetta: "Score (1-5)", tipo: "numero", min: 1, max: 5 },
  { nome: "driver", etichetta: "Driver", tipo: "select", opzioni: DRIVER_OPTIONS },
  {
    nome: "effort",
    etichetta: "Effort",
    tipo: "select",
    opzioni: EFFORT_BUCKETS.map((b) => ({ value: b.valore, label: `${b.valore} gg — ${b.label}` })),
  },
  { nome: "critico_per_business", etichetta: "Critico per Business", tipo: "checkbox" },
  { nome: "owner_progetto", etichetta: "Owner Progetto", tipo: "testo" },
  { nome: "referenti", etichetta: "Referenti", tipo: "testo" },
  { nome: "action_owner", etichetta: "Action Owner", tipo: "testo" },
  { nome: "fonte", etichetta: "Fonte", tipo: "select", opzioni: FONTE_OPTIONS },
  { nome: "jira_code", etichetta: "Codice JIRA", tipo: "testo" },
  { nome: "link_esterno", etichetta: "Link esterno (Jira/DevOps)", tipo: "url" },
  { nome: "quarter_pianificato", etichetta: "Quarter Pianificato", tipo: "testo", placeholder: "es. 2026 Q3" },
  { nome: "due_date", etichetta: "Due Date", tipo: "data" },
  { nome: "due_date_ripianificata", etichetta: "Due Date Ripianificata", tipo: "data" },
  { nome: "deadline_chiusura", etichetta: "Deadline Chiusura", tipo: "data" },
  { nome: "go_live_date", etichetta: "Go Live", tipo: "data" },
  { nome: "last_action", etichetta: "Last Action", tipo: "textarea", largo: true },
  { nome: "to_do", etichetta: "To Do", tipo: "textarea", largo: true },
  { nome: "note", etichetta: "Note", tipo: "textarea", largo: true },
];
