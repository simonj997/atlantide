"use client";

function perInputDate(valore) {
  if (!valore) return "";
  return String(valore).slice(0, 10);
}

// Renderizza un singolo campo del form (testo/select/data/textarea/...) in
// base alla definizione centralizzata in lib/campi.js.
export default function CampoInput({ campo, valore, onChange }) {
  const comune = {
    id: campo.nome,
    name: campo.nome,
  };

  if (campo.tipo === "select") {
    const opzioni = campo.opzioni.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
    return (
      <select {...comune} value={valore ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {opzioni.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (campo.tipo === "checkbox") {
    return (
      <input
        {...comune}
        type="checkbox"
        checked={!!valore}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  if (campo.tipo === "textarea") {
    return <textarea {...comune} value={valore ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }

  if (campo.tipo === "numero") {
    return (
      <input
        {...comune}
        type="number"
        min={campo.min}
        max={campo.max}
        value={valore ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (campo.tipo === "data") {
    return (
      <input
        {...comune}
        type="date"
        value={perInputDate(valore)}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (campo.tipo === "url") {
    return (
      <input {...comune} type="url" value={valore ?? ""} onChange={(e) => onChange(e.target.value)} />
    );
  }

  if (campo.tipo === "testo-multiplo") {
    const testo = Array.isArray(valore) ? valore.join(", ") : (valore ?? "");
    return (
      <input
        {...comune}
        type="text"
        placeholder={campo.placeholder}
        value={testo}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  // "testo" di default
  return (
    <input
      {...comune}
      type="text"
      placeholder={campo.placeholder}
      value={valore ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
