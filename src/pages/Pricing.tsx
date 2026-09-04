import CheckoutModal from "../components/CheckoutModal";
import { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";

const PLANS = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    color: C.stone,
    cta: "Kostenlos starten",
    ctaBg: C.cream,
    ctaText: C.forest,
    ctaBorder: C.border,
    features: ["5 Rezepte / Monat", "Basis-Nährwerte", "Einkaufsliste", "Community-Zugang"],
    missing: ["Blutzucker-Prädiktion", "KI-Wochenplaner", "Personalisierte Empfehlungen"],
  },
  {
    name: "Pro",
    badge: "Beliebt",
    price: { monthly: 9.9, yearly: 7.9 },
    color: C.mint,
    cta: "Pro starten",
    ctaBg: C.forest,
    ctaText: C.white,
    ctaBorder: C.forest,
    highlight: true,
    sub: "14 Tage kostenlos testen",
    features: [
      "Unbegrenzte Rezepte",
      "Blutzucker-Prädiktion",
      "Personalisierte Empfehlungen",
      "KI-Wochenplaner",
      "Stats & Analytics",
      "Premium-Rezepte",
      "Werbefrei",
    ],
  },
  {
    name: "Business",
    price: { monthly: 39, yearly: 31 },
    color: C.coral,
    cta: "Business kontaktieren",
    ctaBg: C.coral,
    ctaText: C.white,
    ctaBorder: C.coral,
    features: [
      "Alles aus Pro",
      "API-Zugang",
      "White-Label Option",
      "Priority Support",
      "Team-Accounts (bis 5)",
      "Erweiterte Analytics",
      "Dedizierter Account Manager",
    ],
  },
];

const FAQS = [
  { q: "Kann ich jederzeit kündigen?", a: "Ja, du kannst dein Abo jederzeit ohne Angabe von Gründen kündigen. Der Zugang bleibt bis zum Ende des bezahlten Zeitraums erhalten." },
  { q: "Gibt es eine kostenlose Testphase?", a: "Der Pro-Plan kann 14 Tage kostenlos getestet werden – ohne Kreditkarte, ohne Risiko." },
  { q: "Wie sicher sind meine Gesundheitsdaten?", a: "Alle Daten sind AES-256-verschlüsselt, DSGVO-konform und werden auf deutschen Servern gespeichert. Wir geben keine Daten an Dritte weiter." },
  { q: "Auf wie vielen Geräten kann ich FUDI nutzen?", a: "Mit Pro kannst du FUDI auf bis zu 3 Geräten gleichzeitig nutzen – Smartphone, Tablet und Desktop." },
  { q: "Ist FUDI auch für Diabetiker geeignet?", a: "Ja, FUDI wurde unter Mitwirkung von Ernährungsmedizinern entwickelt. Allerdings ersetzt es keine medizinische Beratung." },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<{ isOpen: boolean; name: string; monthly: number; yearly: number } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="py-20 text-center" style={{ background: C.cream }}>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ background: C.mintLight, color: C.forest }}>Preise</span>
        <h1 className="text-5xl font-black mt-4 mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
          Transparent. Fair.<br />
          <span style={{ color: C.mint }}>Kündbar jederzeit.</span>
        </h1>
        <p className="text-base max-w-lg mx-auto mb-8" style={{ color: C.inkMid }}>
          Starte kostenlos und upgrade wenn du bereit bist. Kein Risiko.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: yearly ? C.stone : C.forest }}>Monatlich</span>
          <button onClick={() => setYearly(!yearly)}
            className="relative transition-colors"
            style={{ width: 48, height: 26, borderRadius: 13, background: yearly ? C.mint : C.border }}>
            <div className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform"
              style={{ left: yearly ? "calc(100% - 22px)" : 2 }} />
          </button>
          <span className="text-sm font-medium" style={{ color: yearly ? C.forest : C.stone }}>
            Jährlich <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white ml-1" style={{ background: C.mint }}>-20%</span>
          </span>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12" style={{ background: C.white }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl p-6 flex flex-col transition-all hover:-translate-y-1"
                style={{
                  background: p.highlight ? C.forest : C.white,
                  border: `2px solid ${p.highlight ? C.forest : C.border}`,
                  boxShadow: p.highlight ? `0 16px 40px ${C.forest}25` : "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: p.highlight ? C.mint : p.color }}>{p.name}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: p.highlight ? C.white : C.forest }}>
                        {p.price[yearly ? "yearly" : "monthly"] === 0 ? "€0" : `€${p.price[yearly ? "yearly" : "monthly"].toFixed(2).replace(".", ",")}`}
                      </span>
                      {p.price.monthly > 0 && <span className="text-xs mb-1.5" style={{ color: p.highlight ? "rgba(255,255,255,0.6)" : C.stone }}>/Monat</span>}
                    </div>
                    {yearly && p.price.monthly > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: p.highlight ? "rgba(255,255,255,0.5)" : C.stone }}>
                        €{(p.price.yearly * 12).toFixed(2).replace(".", ",")} / Jahr
                      </p>
                    )}
                  </div>
                  {p.badge && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: C.mint, color: C.white }}>{p.badge}</span>
                  )}
                </div>

                <ul className="flex-1 space-y-2 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                        style={{ background: p.highlight ? C.mint : p.color }}>✓</span>
                      <span style={{ color: p.highlight ? "rgba(255,255,255,0.85)" : C.inkMid }}>{f}</span>
                    </li>
                  ))}
                  {"missing" in p && p.missing?.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm opacity-40">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-0.5" style={{ background: C.border, color: C.stone }}>✕</span>
                      <span style={{ color: C.stone }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {p.price.monthly > 0 ? (
                  <button
                    onClick={() => setCheckoutPlan({ isOpen: true, name: p.name, monthly: p.price.monthly, yearly: p.price.yearly })}
                    className="block w-full py-3 rounded-xl text-sm font-bold text-center transition-all hover:opacity-90 active:scale-95 shadow-sm"
                    style={{ background: p.ctaBg, color: p.ctaText, border: `2px solid ${p.ctaBorder}` }}
                  >
                    {p.cta}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="block w-full py-3 rounded-xl text-sm font-bold text-center transition-all hover:opacity-90"
                    style={{ background: p.ctaBg, color: p.ctaText, border: `2px solid ${p.ctaBorder}` }}
                  >
                    {p.cta}
                  </Link>
                )}
                {p.sub && <p className="text-center text-xs mt-2" style={{ color: p.highlight ? "rgba(255,255,255,0.5)" : C.stone }}>{p.sub}</p>}
              </div>
            ))}
          </div>

          {/* Trust */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {["🔒 SSL-verschlüsselt", "🇩🇪 DSGVO-konform", "✂️ Jederzeit kündbar", "💳 Kein Risiko"].map((t) => (
              <span key={t} className="text-sm" style={{ color: C.stone }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

{checkoutPlan && (
        <CheckoutModal
          isOpen={checkoutPlan.isOpen}
          onClose={() => setCheckoutPlan(null)}
          planName={checkoutPlan.name}
          priceMonthly={checkoutPlan.monthly}
          priceYearly={checkoutPlan.yearly}
          yearly={yearly}
        />
      )}

      {/* Compare table */}
      <section className="py-16" style={{ background: C.cream }}>
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-black text-center mb-8" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Plan-Vergleich
          </h2>
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: C.cream }}>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: C.stone }}>Feature</th>
                  <th className="px-4 py-3 text-center text-xs font-bold" style={{ color: C.stone }}>Free</th>
                  <th className="px-4 py-3 text-center text-xs font-bold" style={{ color: C.mint }}>Pro</th>
                  <th className="px-4 py-3 text-center text-xs font-bold" style={{ color: C.coral }}>Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Rezepte", "5/Monat", "Unbegrenzt", "Unbegrenzt"],
                  ["Blutzucker-Prädiktion", "✕", "✓", "✓"],
                  ["KI-Wochenplaner", "✕", "✓", "✓"],
                  ["Stats & Analytics", "✕", "✓", "Erweitert"],
                  ["Werbefrei", "✕", "✓", "✓"],
                  ["API-Zugang", "✕", "✕", "✓"],
                  ["Team-Accounts", "✕", "✕", "Bis 5"],
                  ["Support", "Community", "E-Mail", "Priority"],
                ].map(([feat, free, pro, biz]) => (
                  <tr key={feat} className="border-t" style={{ borderColor: C.border }}>
                    <td className="px-4 py-3" style={{ color: C.inkMid }}>{feat}</td>
                    <td className="px-4 py-3 text-center text-xs" style={{ color: free === "✕" ? C.border : C.stone }}>{free}</td>
                    <td className="px-4 py-3 text-center text-xs font-semibold" style={{ color: pro === "✕" ? C.border : C.mint }}>{pro}</td>
                    <td className="px-4 py-3 text-center text-xs font-semibold" style={{ color: biz === "✕" ? C.border : C.coral }}>{biz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" style={{ background: C.white }}>
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="text-3xl font-black text-center mb-8" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>Häufige Fragen</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-4 py-4 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold" style={{ color: C.forest }}>{faq.q}</span>
                  <span className="text-lg transition-transform" style={{ transform: openFaq === i ? "rotate(45deg)" : "", color: C.stone }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: C.stone }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
