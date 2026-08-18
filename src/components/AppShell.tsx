import { Link } from "@tanstack/react-router";
import { Camera, LayoutGrid, Package, ScrollText } from "lucide-react";
import type { ReactNode } from "react";
import { AccessibilityBar } from "./AccessibilityBar";
import { useSpeakable } from "./a11y";

const NAV = [
  { to: "/", label: "Aangan", meaning: "Home", icon: LayoutGrid },
  { to: "/upload", label: "Naya Kaam", meaning: "Add a craft", icon: Camera },
  { to: "/products", label: "Sangrah", meaning: "My crafts", icon: Package },
  { to: "/orders", label: "Farmaish", meaning: "Orders", icon: ScrollText },
] as const;

function NavItem({ item }: { item: (typeof NAV)[number] }) {
  const speak = useSpeakable(`${item.label}. ${item.meaning}`);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      {...speak}
      activeOptions={{ exact: item.to === "/" }}
      activeProps={{ "data-active": "true" }}
      className="group flex min-h-14 items-center gap-3 rounded-xl border-2 border-transparent px-3 py-2 text-primary-foreground/85 transition-colors hover:border-marigold/60 hover:text-primary-foreground data-[active=true]:border-marigold data-[active=true]:bg-marigold data-[active=true]:text-marigold-foreground"
    >
      <Icon className="size-6 shrink-0" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block font-display text-base leading-tight font-bold">{item.label}</span>
        <span className="block text-xs leading-tight opacity-80">{item.meaning}</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-vermillion focus:px-4 focus:py-3 focus:text-vermillion-foreground"
      >
        Skip to main content
      </a>

      <AccessibilityBar />

      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 lg:flex lg:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span
              className="grid size-12 shrink-0 place-items-center rounded-full bg-marigold font-accent text-2xl text-marigold-foreground"
              aria-hidden="true"
            >
              क
            </span>
            <span className="min-w-0">
              <span className="block truncate font-accent text-2xl">Kalakriti</span>
              <span className="block truncate text-xs tracking-[0.2em] uppercase opacity-80">
                Artisan Studio
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="col-span-2 lg:col-auto">
            <ul className="flex flex-wrap gap-2">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavItem item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="kolam-rule" aria-hidden="true" />
      </header>

      <main id="main">{children}</main>

      <footer className="mt-16 jewel-surface">
        <div className="kolam-rule" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="font-accent text-2xl">Kalakriti</p>
          <p className="mt-2 max-w-xl text-sm opacity-85">
            Built so that every artisan — deaf, blind, low-vision, with limited hand movement, or
            new to phones — can sell a craft without learning a single technical word.
          </p>
          <p className="mt-4 text-xs tracking-[0.2em] uppercase opacity-70">
            Keyboard first · Screen-reader tested · WCAG AA contrast
          </p>
        </div>
      </footer>
    </div>
  );
}
