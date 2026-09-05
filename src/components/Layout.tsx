import { useState } from "react";
import { Link, useLocation } from "react-router";
import { C } from "../shared/colors";

const NAV_LINKS = [
  { to: "/rezepte",    label: "Rezepte" },
  { to: "/blutzucker", label: "Blutzucker" },
  { to: "/planer",     label: "Wochenplaner" },
  { to: "/preise",     label: "Preise" },
  { to: "/fitness",     label: "Fitness" },
];

const BOTTOM_TABS = [
  { to: "/dashboard",  icon: "⌂",  label: "Home" },
  { to: "/rezepte",    icon: "🔍", label: "Rezepte" },
  { to: "/planer",     icon: "📅", label: "Planer" },
  { to: "/einkauf",    icon: "🛒", label: "Liste" },
  { to: "/profil",     icon: "👤", label: "Profil" },
];

const APP_PATHS = ["/dashboard", "/rezepte", "/planer", "/einkauf", "/profil", "/stats", "/blutzucker", "/fitness"];

export function TopNav({ authenticated = false }: { authenticated?: boolean }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const isActive = (to: string) => loc.pathname.startsWith(to);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm"
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between gap-6" style={{ height: 60 }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl font-black tracking-tight" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.04em" }}>FUDI</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: C.mintLight, color: C.mint }}>2.0</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium transition-colors relative group"
              style={{ color: isActive(l.to) ? C.forest : C.stone }}>
              {l.label}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-transform origin-left scale-x-0 group-hover:scale-x-100"
                style={{ background: C.mint, transform: isActive(l.to) ? "scaleX(1)" : undefined }} />
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2.5">
          {authenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50" style={{ color: C.stone }}>
                Dashboard
              </Link>
              {typeof window !== "undefined" && localStorage.getItem("fudi_pro_active") === "true" && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                  PRO
                </span>
              )}
              <Link to="/profil" className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform hover:scale-105" style={{ background: C.mint }}>
                M
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50" style={{ color: C.stone }}>
                Einloggen
              </Link>
              <Link to="/register" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: C.forest }}>
                Kostenlos starten
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1.5 flex flex-col gap-1 justify-center" style={{ width: 32, height: 32 }} onClick={() => setOpen(!open)}>
          <span className="block w-5 h-0.5 rounded bg-gray-800 transition-all duration-200"
            style={{ transform: open ? "rotate(45deg) translateY(6px)" : "none" }} />
          <span className="block w-5 h-0.5 rounded bg-gray-800 transition-all duration-200"
            style={{ opacity: open ? 0 : 1 }} />
          <span className="block w-5 h-0.5 rounded bg-gray-800 transition-all duration-200"
            style={{ transform: open ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? 320 : 0, borderTop: open ? `1px solid ${C.border}` : "none" }}>
        <div className="px-5 pb-4 pt-3 flex flex-col gap-2 bg-white">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="py-2 text-sm font-medium" style={{ color: C.inkMid }} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to="/register" className="mt-2 py-2.5 text-center text-sm font-semibold rounded-lg text-white" style={{ background: C.forest }} onClick={() => setOpen(false)}>
            Kostenlos starten
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function BottomTabs() {
  const loc = useLocation();
  // use startsWith so /rezepte/123 still highlights Rezepte tab
  const isActive = (to: string) => loc.pathname === to || (to !== "/dashboard" && loc.pathname.startsWith(to));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm"
      style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="flex">
        {BOTTOM_TABS.map((t) => {
          const active = isActive(t.to);
          return (
            <Link key={t.to} to={t.to} className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-opacity active:opacity-70">
              <span className="text-lg leading-none" style={{ filter: active ? "none" : "grayscale(1) opacity(0.5)" }}>{t.icon}</span>
              <span className="text-[10px] font-semibold transition-colors" style={{ color: active ? C.forest : C.stone }}>
                {t.label}
              </span>
              {active && <div className="w-4 h-0.5 rounded-full" style={{ background: C.forest }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Layout({ children, authenticated = false }: { children: React.ReactNode; authenticated?: boolean }) {
  const loc = useLocation();
  const isApp = APP_PATHS.some((p) => loc.pathname.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.cream }}>
      <TopNav authenticated={isApp || authenticated} />
      <main className="flex-1 pt-[60px]" style={{ paddingBottom: isApp ? 64 : 0 }}>
        {children}
      </main>

      {/* Global Trust & Compliance Footer */}
      <footer className="border-t py-8 px-5 bg-white/60 text-center text-xs mt-auto" style={{ borderColor: C.border, color: C.stone }}>
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold" style={{ color: C.forest }}>
            <Link to="/rezepte" className="hover:underline">Rezepte</Link>
            <span>•</span>
            <Link to="/blutzucker" className="hover:underline">Blutzucker-Rechner</Link>
            <span>•</span>
            <Link to="/planer" className="hover:underline">Wochenplaner</Link>
            <span>•</span>
            <Link to="/preise" className="hover:underline">Preise &amp; Abos</Link>
            <span>•</span>
            <span className="text-gray-400 cursor-not-allowed">Impressum</span>
            <span>•</span>
            <span className="text-gray-400 cursor-not-allowed">Datenschutz (DSGVO)</span>
          </div>
          <p className="text-[11px] leading-relaxed max-w-2xl mx-auto opacity-75">
            <b>Gesundheitlicher Hinweis:</b> FUDI bietet ernährungswissenschaftliche Bildungs- und Planungs-Tools auf Basis des Glykämischen Index (GI) und Nährwerttabellen. Die Blutzucker-Berechnungen sind modellbasierte Schätzungen und stellen keine medizinische Diagnose, Behandlungsempfehlung oder Ersatz für eine ärztliche Konsultation dar.
          </p>
          <p className="text-[10px] text-gray-400">
            © 2026 FUDI Health Technologies • Alle Rechte vorbehalten
          </p>
        </div>
      </footer>

      {isApp && <BottomTabs />}
    </div>
  );
}


