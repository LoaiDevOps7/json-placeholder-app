"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <span>دمج </span>واجهات
      </div>

      <div className="nav-links">
        <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
          الرئيسية
        </Link>
        <Link
          href="/json"
          className={`nav-link ${isActive("/json") ? "active" : ""}`}
        >
          بيانات JSON
        </Link>
        <Link
          href="/websocket"
          className={`nav-link ${isActive("/websocket") ? "active" : ""}`}
        >
          WebSocket
        </Link>
      </div>
    </nav>
  );
}
