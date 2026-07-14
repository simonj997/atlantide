"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "▤" },
  { href: "/progetti", label: "Progetti", icon: "☰" },
  { href: "/capacity", label: "Risorse & Capacity", icon: "👥" },
  { href: "/regole", label: "Regole", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="sidebar" style={{ display: "flex", flexDirection: "column" }}>
      <div className="brand">
        <span className="mark"></span>Atlantide
      </div>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item${pathname === item.href ? " active" : ""}`}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </Link>
      ))}
      <div style={{ flex: 1 }}></div>
      <div className="nav-item" onClick={handleLogout}>
        <span className="nav-icon">↪</span>Esci
      </div>
    </div>
  );
}
