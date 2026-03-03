"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/", label: "Loja" },
  { href: "/carrinho", label: "Carrinho" },
  { href: "/conta", label: "Conta" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="shell nav-row">
        <Link href="/" className="brand">
          Orbita Shop
        </Link>
        <nav className="nav-links">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "is-active" : ""}`}
              >
                {link.label}
                {link.href === "/carrinho" && totalItems > 0 ? (
                  <span className="nav-badge">{totalItems}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

