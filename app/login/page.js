"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState(null);
  const [caricamento, setCaricamento] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore(null);
    setCaricamento(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setCaricamento(false);

    if (error) {
      setErrore("Email o password non corrette.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 32,
          width: 320,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 24 }}>
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: "linear-gradient(135deg, var(--accent), #2C5C82)",
              display: "inline-block",
            }}
          ></span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Atlantide</span>
        </div>
        <label style={{ display: "block", fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 9,
            marginBottom: 14,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--panel-2)",
            color: "var(--text)",
          }}
        />
        <label style={{ display: "block", fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 9,
            marginBottom: 18,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--panel-2)",
            color: "var(--text)",
          }}
        />
        {errore && (
          <div style={{ color: "var(--risk)", fontSize: 13, marginBottom: 14 }}>{errore}</div>
        )}
        <button type="submit" className="btn" disabled={caricamento} style={{ width: "100%" }}>
          {caricamento ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>
    </div>
  );
}
