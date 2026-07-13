"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "▤" },
  { href: "/progetti", label: "Progetti", icon: "☰" },
  { href: "/capacity", label: "Risorse & Capacity", icon: "👥" },
  { href: "/regole", label: "Regole", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
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
    </div>
  );
}
