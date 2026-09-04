import { Link } from "react-router";
import { C } from "../shared/colors";
import { IMG, RECIPES } from "../shared/images";

// ── Mini SVG sparkline ────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 120, h = 40;
  const mn = Math.min(...data), mx = Math.max(...data);
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - mn) / (mx - mn + 1)) * h,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Floating hero cards ───────────────────────────────────────────
function HeroFloatCard() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0" style={{ height: 380 }}>
      {/* Main food image */}
      <div className="absolute inset-x-8 top-0 bottom-16 rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 24px 64px rgba(45,80,22,0.18)" }}>
        <img src={IMG.heroBowl} alt="Gesunde Buddha Bowl" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,80,22,0.5) 0%, transparent 60%)" }} />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm font-semibold">Buddha Bowl</p>
          <div className="flex gap-3 mt-1">
            <span className="text-white/80 text-xs">420 kcal</span>
            <span className="text-white/80 text-xs">20 min</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{ background: C.mint }}>Low GI</span>
          </div>
        </div>
      </div>

      {/* Blood sugar card */}
      <div
        className="absolute bottom-0 right-0 bg-white rounded-2xl p-3 shadow-xl animate-float"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-semibold" style={{ color: C.stone }}>Blutzucker</span>
          <span className="text-[10px] font-bold px-1.5 rounded-full text-white" style={{ background: C.mint }}>Normal</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>112</span>
          <span className="text-xs mb-1" style={{ color: C.stone }}>mg/dL</span>
        </div>
        <Sparkline data={[118, 122, 140, 155, 148, 132, 118, 112]} color={C.mint} />
        <p className="text-[10px] mt-1" style={{ color: C.mint }}>↘ stabil sinkend</p>
      </div>

      {/* KI badge */}
      <div
        className="absolute top-4 left-0 bg-white rounded-xl px-3 py-2 shadow-lg"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
      >
        <span className="text-[10px] font-semibold block" style={{ color: C.stone }}>KI-Prognose</span>
        <span className="text-sm font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.coral }}>+28 mg/dL</span>
      </div>
    </div>
  );
}

// ── Section: Hero ─────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: C.cream }}>
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.mint} 0%, transparent 70%)`, transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.coral} 0%, transparent 70%)`, transform: "translate(-30%, 30%)" }} />

      <div className="max-w-6xl mx-auto px-5 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            style={{ background: C.mintLight, color: C.forest, border: `1px solid ${C.mint}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.mint }} />
            KI-gestützte Ernährungsplanung
          </div>
          <h1
            className="text-5xl lg:text-6xl font-black leading-[1.06] mb-5"
            style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}
          >
            Iss gesund.{" "}
            <span style={{ color: C.mint }}>Bleib fit.</span>
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${C.coral}, ${C.mint})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Verstehe deinen Körper.
            </span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: C.inkMid }}>
            KI-gestützte Rezepte mit personalisierten Blutzucker-Prädiktionen. Ernähre dich smarter –
            basierend auf deinen echten Körperdaten.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 text-base font-bold px-8 py-3.5 rounded-xl text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: C.forest, boxShadow: `0 4px 20px ${C.forest}30` }}
            >
              Kostenlos starten →
            </Link>
            <Link
              to="/rezepte"
              className="inline-flex items-center justify-center gap-2 text-base font-semibold px-8 py-3.5 rounded-xl border-2 transition-all hover:bg-white"
              style={{ borderColor: C.border, color: C.stone }}
            >
              Rezepte entdecken
            </Link>
          </div>
          <div className="flex flex-wrap gap-5">
            {[
              { icon: "🛡️", label: "DSGVO-konform" },
              { icon: "🔬", label: "Wissenschaftlich fundiert" },
              { icon: "👥", label: "10.000+ Nutzer" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-sm" style={{ color: C.stone }}>
                <span>{b.icon}</span><span className="font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <HeroFloatCard />
      </div>

      {/* Stats strip */}
      <div className="border-t border-b" style={{ borderColor: C.border, background: C.white }}>
        <div className="max-w-6xl mx-auto px-5 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: "10K+", label: "Aktive Nutzer" },
            { val: "50K+", label: "Analysierte Mahlzeiten" },
            { val: "2.800+", label: "Gesunde Rezepte" },
            { val: "94%", label: "Zufriedenheit" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color: C.stone }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Features ─────────────────────────────────────────────
function Features() {
  const items = [
    { icon: "🍽️", accent: C.mint,   title: "Personalisierte Rezepte",        text: "2.800+ Rezepte gefiltert nach Allergien, Nährwerten und Blutzucker. KI wählt was wirklich zu dir passt." },
    { icon: "📊", accent: C.forest,  title: "Blutzucker-Prädiktion",           text: "Sieh vorher, wie jede Mahlzeit deinen Blutzucker beeinflusst. Ampelfarben. Verlaufskurve. Handlungsempfehlungen." },
    { icon: "🛒", accent: C.coral,   title: "Automatische Einkaufslisten",    text: "Aus deinem Wochenplan wird sofort eine sortierte Liste. Mit Preisschätzung und Teilen-Funktion." },
    { icon: "📅", accent: C.stone,   title: "KI-Wochenplaner",               text: "Drag & Drop deine Lieblingsrezepte. Die KI füllt Lücken automatisch mit optimalen Mahlzeiten." },
    { icon: "📈", accent: C.mint,   title: "Stats & Analytics",              text: "Wann ist dein Blutzucker am besten? Welche Mahlzeiten funktionieren? Echte Insights, keine Generika." },
    { icon: "🔔", accent: C.coral,   title: "Smarte Erinnerungen",            text: "Mahlzeiten-Erinnerungen, Blutzucker-Alerts genau dann, wenn du sie brauchst." },
  ];

  return (
    <section className="py-20" style={{ background: C.white }}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ background: C.mintLight, color: C.forest }}>Features</span>
          <h2 className="text-4xl font-black mt-4 mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Alles in einer App.
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: C.inkMid }}>FUDI verbindet Ernährungswissenschaft mit deinen persönlichen Körperdaten.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
              style={{ background: C.cream, borderColor: C.border }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background: f.accent + "18" }}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.stone }}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Recipe showcase ──────────────────────────────────────
function RecipeShowcase() {
  const shown = RECIPES.slice(0, 4);
  return (
    <section className="py-20" style={{ background: C.cream }}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ background: C.coralLight, color: C.coral }}>Rezepte</span>
            <h2 className="text-4xl font-black mt-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
              Gesund &amp; lecker.
            </h2>
          </div>
          <Link to="/rezepte" className="text-sm font-semibold hidden md:block" style={{ color: C.mint }}>Alle anzeigen →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shown.map((r) => (
            <Link
              key={r.id}
              to={`/rezepte/${r.id}`}
              className="bg-white rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg block"
              style={{ borderColor: C.border }}
            >
              <div className="h-44 relative overflow-hidden" style={{ background: C.mintLight }}>
                <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                <div
                  className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: r.gi === "low" ? C.mint : C.coral }}
                >
                  {r.gi === "low" ? "Low GI" : "Med GI"}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm mb-1.5" style={{ color: C.forest }}>{r.title}</h3>
                <div className="flex gap-2 text-[11px]" style={{ color: C.stone }}>
                  <span>⏱ {r.time}min</span>
                  <span>🔥 {r.kcal} kcal</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: r.gi === "low" ? C.mint : C.coral }} />
                  <span className="text-[10px] font-semibold" style={{ fontFamily: "'JetBrains Mono',monospace", color: r.gi === "low" ? C.mint : C.coral }}>
                    +{r.impact} mg/dL
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link to="/rezepte" className="text-sm font-semibold" style={{ color: C.mint }}>Alle Rezepte anzeigen →</Link>
        </div>
      </div>
    </section>
  );
}

// ── Section: How it works ─────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", icon: "👤", title: "Profil anlegen",      text: "Gesundheitsdaten, Ziele, Ernährungsvorlieben – in unter 5 Minuten.", accent: C.forest },
    { n: "02", icon: "🎯", title: "Präferenzen setzen",  text: "Allergien, Lieblingsküchen, Budget und Kochzeit – FUDI passt sich dir an.", accent: C.mint },
    { n: "03", icon: "🍽️", title: "Rezepte entdecken",  text: "Smarte Empfehlungen mit Blutzucker-Ampel, Makros und Nährwerten.", accent: C.coral },
    { n: "04", icon: "🎉", title: "Gesünder genießen",   text: "Dein Körper, deine Daten, deine Entscheidungen. Jeden Tag besser.", accent: C.forest },
  ];

  return (
    <section className="py-20" style={{ background: C.forest }}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ background: "rgba(127,176,105,0.2)", color: C.mint }}>
            So funktioniert es
          </span>
          <h2 className="text-4xl font-black mt-4 text-white" style={{ fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.03em" }}>
            In 4 Schritten zu besserer Gesundheit
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4" style={{ background: "rgba(255,255,255,0.1)" }}>
                {s.icon}
              </div>
              <span className="text-5xl font-black absolute top-0 right-0 opacity-10 text-white" style={{ fontFamily: "'DM Sans',sans-serif" }}>{s.n}</span>
              <h3 className="text-base font-bold mb-2 text-white" style={{ fontFamily: "'DM Sans',sans-serif" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Testimonials ─────────────────────────────────────────
function Testimonials() {
  const items = [
    { q: "Seit FUDI weiß ich endlich, warum mein Blutzucker nach manchen Mahlzeiten durch die Decke geht. Game-changer für meine Diabetes-Kontrolle.", name: "Maria S.", role: "Typ-2-Diabetikerin", a: "M", color: C.mint },
    { q: "Die Rezeptempfehlungen sind unglaublich personalisiert. Ich esse seit 3 Monaten abwechslungsreicher als je zuvor – und meine Werte sind besser.", name: "Thomas K.", role: "Sportler & Ernährungsbewusster", a: "T", color: C.coral },
    { q: "Der KI-Wochenplaner spart mir jeden Sonntag eine Stunde Planung. Die Einkaufsliste ist direkt fertig – perfekt für unsere Familie.", name: "Julia R.", role: "Mutter von 2 Kindern", a: "J", color: C.forest },
  ];
  return (
    <section className="py-20" style={{ background: C.white }}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>Was unsere Nutzer sagen</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="rounded-2xl p-6 border" style={{ background: C.cream, borderColor: C.border }}>
              <div className="flex mb-3">{"★★★★★".split("").map((s, i) => <span key={i} className="text-sm" style={{ color: C.coral }}>{s}</span>)}</div>
              <p className="text-sm leading-relaxed mb-5 italic" style={{ color: C.inkMid }}>"{t.q}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: t.color }}>{t.a}</div>
                <div>
                  <div className="text-sm font-bold" style={{ color: C.forest }}>{t.name}</div>
                  <div className="text-xs" style={{ color: C.stone }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: CTA ──────────────────────────────────────────────────
function CtaBanner() {
  return (
    <section className="py-20" style={{ background: C.cream }}>
      <div className="max-w-3xl mx-auto px-5 text-center">
        <div className="rounded-3xl p-10 lg:p-14" style={{ background: C.forest }}>
          <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.03em" }}>
            Bereit für deinen gesündesten Alltag?
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            Kostenlos starten – keine Kreditkarte nötig.
          </p>
          <Link
            to="/register"
            className="inline-block text-base font-bold px-10 py-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: C.mint, color: C.white, boxShadow: `0 4px 24px ${C.mint}40` }}
          >
            Jetzt kostenlos starten
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "Produkt",     links: ["Rezepte", "Blutzucker-Rechner", "Wochenplaner", "Einkaufsliste", "Stats"] },
    { title: "Unternehmen", links: ["Über uns", "Blog", "Karriere", "Presse"] },
    { title: "Support",     links: ["Hilfe-Center", "Community", "Kontakt", "API-Docs"] },
    { title: "Rechtliches", links: ["Datenschutz", "AGB", "Impressum", "Cookies"] },
  ];
  return (
    <footer style={{ background: C.forest }}>
      <div className="max-w-6xl mx-auto px-5 pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-black mb-2" style={{ fontFamily: "'DM Sans',sans-serif", color: C.mint, letterSpacing: "-0.04em" }}>FUDI</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>KI-gestützte Ernährung mit Blutzucker-Intelligenz.</p>
            <div className="flex gap-2">
              {["𝕏", "in", "ig"].map((s) => (
                <a key={s} href="#" className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>{s}</a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>{col.title}</div>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-5 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 FUDI GmbH. Alle Rechte vorbehalten.</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Kein medizinischer Rat. Konsultiere deinen Arzt.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page export ───────────────────────────────────────────────────
export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <RecipeShowcase />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </>
  );
}
