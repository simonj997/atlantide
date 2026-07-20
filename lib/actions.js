"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { CAMPI_PROGETTO } from "./campi";

async function richiedeUtenteAutenticato(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Devi essere autenticato per completare questa operazione.");
  }
}

// Normalizza un oggetto "campi" grezzo (dal form) in un oggetto pronto per
// Supabase, applicando solo i nomi noti in CAMPI_PROGETTO e convertendo i
// tipi (numero, array, booleano) in base alla definizione del campo.
function normalizzaCampiProgetto(campi) {
  const risultato = {};
  for (const def of CAMPI_PROGETTO) {
    if (!(def.nome in campi)) continue;
    const grezzo = campi[def.nome];

    if (def.tipo === "checkbox") {
      risultato[def.nome] = !!grezzo;
    } else if (def.tipo === "numero") {
      const n = Number(grezzo);
      risultato[def.nome] = grezzo === "" || grezzo === null || Number.isNaN(n) ? null : n;
    } else if (def.tipo === "testo-multiplo") {
      if (Array.isArray(grezzo)) {
        risultato[def.nome] = grezzo;
      } else {
        const s = String(grezzo || "").trim();
        risultato[def.nome] = s === "" ? null : s.split(",").map((x) => x.trim()).filter(Boolean);
      }
    } else {
      const s = grezzo === null || grezzo === undefined ? "" : String(grezzo).trim();
      risultato[def.nome] = s === "" ? null : s;
    }
  }
  return risultato;
}

export async function creaProgetto(idProgetto, campi) {
  const supabase = await createSupabaseServerClient();
  await richiedeUtenteAutenticato(supabase);

  const codice = String(idProgetto || "").trim();
  if (!codice) {
    throw new Error("Il codice progetto è obbligatorio.");
  }

  const dati = {
    id_progetto: codice,
    fonte: "Manuale",
    ...normalizzaCampiProgetto(campi),
  };

  const { error } = await supabase.from("progetti").insert(dati);
  if (error) {
    throw new Error(
      error.code === "23505"
        ? `Esiste già un progetto con codice "${codice}".`
        : error.message
    );
  }

  revalidatePath("/progetti");
  revalidatePath("/");
  redirect(`/progetti/${encodeURIComponent(codice)}`);
}

export async function updateProgetto(idProgetto, campi) {
  const supabase = await createSupabaseServerClient();
  await richiedeUtenteAutenticato(supabase);

  const aggiornamento = {
    ...normalizzaCampiProgetto(campi),
    data_aggiornamento: new Date().toISOString().slice(0, 10),
  };

  const { error } = await supabase
    .from("progetti")
    .update(aggiornamento)
    .eq("id_progetto", idProgetto);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/progetti");
  revalidatePath("/");
  redirect("/progetti");
}

// Variante per la modifica in linea nella tabella: non reindirizza, ritorna
// solo esito/errore.
export async function updateProgettoInline(idProgetto, campi) {
  const supabase = await createSupabaseServerClient();

  try {
    await richiedeUtenteAutenticato(supabase);
  } catch (e) {
    return { errore: e.message };
  }

  const aggiornamento = {
    ...normalizzaCampiProgetto(campi),
    data_aggiornamento: new Date().toISOString().slice(0, 10),
  };

  const { error } = await supabase
    .from("progetti")
    .update(aggiornamento)
    .eq("id_progetto", idProgetto);

  if (error) {
    return { errore: error.message };
  }

  revalidatePath("/progetti");
  revalidatePath("/");
  return { ok: true };
}

export async function eliminaProgetto(idProgetto) {
  const supabase = await createSupabaseServerClient();
  await richiedeUtenteAutenticato(supabase);

  const { error } = await supabase.from("progetti").delete().eq("id_progetto", idProgetto);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/progetti");
  revalidatePath("/");
  redirect("/progetti");
}

// --- Allocazioni ---

function numeroONull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export async function creaAllocazione({
  id_progetto,
  nome,
  cognome,
  ruolo,
  effort_pianificato,
  effort_effettivo,
}) {
  const supabase = await createSupabaseServerClient();
  try {
    await richiedeUtenteAutenticato(supabase);
  } catch (e) {
    return { errore: e.message };
  }

  if (!id_progetto || !nome || !cognome) {
    return { errore: "Progetto e risorsa sono obbligatori." };
  }

  const { error } = await supabase.from("allocazioni").insert({
    id_progetto,
    nome,
    cognome,
    ruolo: ruolo || null,
    effort_pianificato: numeroONull(effort_pianificato),
    effort_effettivo: numeroONull(effort_effettivo),
  });

  if (error) {
    return { errore: error.message };
  }

  revalidatePath("/capacity");
  revalidatePath("/allocazioni");
  revalidatePath("/progetti");
  revalidatePath("/");
  return { ok: true };
}

export async function updateAllocazione(id, campi) {
  const supabase = await createSupabaseServerClient();
  try {
    await richiedeUtenteAutenticato(supabase);
  } catch (e) {
    return { errore: e.message };
  }

  const aggiornamento = {};
  if ("ruolo" in campi) aggiornamento.ruolo = campi.ruolo || null;
  if ("effort_pianificato" in campi) aggiornamento.effort_pianificato = numeroONull(campi.effort_pianificato);
  if ("effort_effettivo" in campi) aggiornamento.effort_effettivo = numeroONull(campi.effort_effettivo);

  const { error } = await supabase.from("allocazioni").update(aggiornamento).eq("id", id);
  if (error) {
    return { errore: error.message };
  }

  revalidatePath("/capacity");
  revalidatePath("/allocazioni");
  revalidatePath("/progetti");
  revalidatePath("/");
  return { ok: true };
}

export async function eliminaAllocazione(id) {
  const supabase = await createSupabaseServerClient();
  try {
    await richiedeUtenteAutenticato(supabase);
  } catch (e) {
    return { errore: e.message };
  }

  const { error } = await supabase.from("allocazioni").delete().eq("id", id);
  if (error) {
    return { errore: error.message };
  }

  revalidatePath("/capacity");
  revalidatePath("/allocazioni");
  revalidatePath("/progetti");
  revalidatePath("/");
  return { ok: true };
}
