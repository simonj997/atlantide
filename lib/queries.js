import { computeRisk } from "./risk";

export async function getProgettiConAllocazioni(supabase) {
  const [{ data: progetti, error: erroreProgetti }, { data: allocazioni, error: erroreAllocazioni }] =
    await Promise.all([
      supabase.from("progetti").select("*"),
      supabase.from("allocazioni").select("*"),
    ]);

  if (erroreProgetti) throw erroreProgetti;
  if (erroreAllocazioni) throw erroreAllocazioni;

  return progetti.map((progetto) => {
    const allocazioniProgetto = (allocazioni || []).filter(
      (a) => a.id_progetto === progetto.id_progetto
    );
    const team = allocazioniProgetto.map(
      (a) => `${a.persona}${a.ruolo ? ` (${a.ruolo})` : ""}`
    );
    const effortTot = allocazioniProgetto.reduce(
      (somma, a) => somma + (Number(a.effort_pianificato) || 0),
      0
    );

    return { ...progetto, team, effortTot, risk: computeRisk(progetto) };
  });
}

export async function getAllocazioniPerPersona(supabase) {
  const { data: allocazioni, error } = await supabase.from("allocazioni").select("*");
  if (error) throw error;

  const perPersona = new Map();
  for (const a of allocazioni || []) {
    if (!perPersona.has(a.persona)) {
      perPersona.set(a.persona, {
        persona: a.persona,
        ruoli: new Set(),
        totalePianificato: 0,
        totaleEffettivo: 0,
      });
    }
    const voce = perPersona.get(a.persona);
    if (a.ruolo) voce.ruoli.add(a.ruolo);
    voce.totalePianificato += Number(a.effort_pianificato) || 0;
    voce.totaleEffettivo += Number(a.effort_effettivo) || 0;
  }

  return Array.from(perPersona.values()).map((voce) => ({
    ...voce,
    ruoli: Array.from(voce.ruoli).join(", "),
  }));
}
