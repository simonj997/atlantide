"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

function valoreOTesto(formData, campo) {
  const v = formData.get(campo);
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function valoreONumero(formData, campo) {
  const s = valoreOTesto(formData, campo);
  if (s === null) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function valoreODataArray(formData, campo) {
  const s = valoreOTesto(formData, campo);
  if (s === null) return null;
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function updateProgetto(idProgetto, formData) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Devi essere autenticato per modificare un progetto.");
  }

  const aggiornamento = {
    area: valoreOTesto(formData, "area"),
    prodotto: valoreODataArray(formData, "prodotto"),
    macro_attivita: valoreOTesto(formData, "macro_attivita"),
    descrizione: valoreOTesto(formData, "descrizione"),
    priorita: valoreOTesto(formData, "priorita"),
    stato: valoreOTesto(formData, "stato"),
    jira_code: valoreOTesto(formData, "jira_code"),
    fonte: valoreOTesto(formData, "fonte"),
    owner_progetto: valoreOTesto(formData, "owner_progetto"),
    referenti: valoreOTesto(formData, "referenti"),
    action_owner: valoreOTesto(formData, "action_owner"),
    last_action: valoreOTesto(formData, "last_action"),
    to_do: valoreOTesto(formData, "to_do"),
    due_date: valoreOTesto(formData, "due_date"),
    due_date_ripianificata: valoreOTesto(formData, "due_date_ripianificata"),
    deadline_chiusura: valoreOTesto(formData, "deadline_chiusura"),
    go_live_date: valoreOTesto(formData, "go_live_date"),
    quarter_pianificato: valoreOTesto(formData, "quarter_pianificato"),
    critico_per_business: formData.get("critico_per_business") === "on",
    note: valoreOTesto(formData, "note"),
    effort: valoreOTesto(formData, "effort"),
    score: valoreONumero(formData, "score"),
    driver: valoreOTesto(formData, "driver"),
    link_esterno: valoreOTesto(formData, "link_esterno"),
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
