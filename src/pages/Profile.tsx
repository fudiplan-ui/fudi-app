import { useState } from "react";
import { C } from "../shared/colors";

const SECTIONS = ["Profil", "Gesundheit", "Ziele", "Praeferenzen", "Abo", "Datenschutz"];

function Toggle({ label, sub, val, onChange }: { label: string; sub?: string; val: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0" style={{ borderColor: C.border }}>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: C.forest }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: C.stone }}>{sub}</p>}
      </div>
      <button onClick={() => onChange(!val)} className="relative shrink-0 transition-colors"
        style={{ width: 40, height: 22, borderRadius: 11, background: val ? C.mint : C.border }}>
        <div className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform"
          style={{ width: 18, height: 18, left: val ? "calc(100% - 20px)" : 2 }} />
      </button>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  const [val, setVal] = useState(defaultValue || "");
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: C.stone }}>{label}</label>
      <input type={type} value={val} onChange={(e) => setVal(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
        style={{ borderColor: C.border, background: C.white, color: C.ink }} />
    </div>
  );
}

export default function Profile() {
  // Load user profile from localStorage
  const rawProfile = typeof window !== "undefined" ? localStorage.getItem("fudi_user_profile") : null;
  const userProfile = rawProfile ? JSON.parse(rawProfile) : {};
  const displayName = userProfile.name || "Nutzer";
  const displayEmail = userProfile.email || "";
  const displayInitial = (userProfile.name || "N")[0].toUpperCase();
  const [section, setSection] = useState("Profil");
  const [notifEat, setNotifEat]     = useState(true);
  const [notifBs, setNotifBs]       = useState(true);
  const [notifShop, setNotifShop]   = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [unit, setUnit]             = useState<"mg/dL" | "mmol/L">("mg/dL");
  const [kcalUnit, setKcalUnit]     = useState<"kcal" | "kJ">("kcal");
  const [goal, setGoal]             = useState("Abnehmen");
  const [activity, setActivity]     = useState(2);
  const [dietType, setDietType]     = useState("Allesesser");
  const [plan, setPlan]             = useState("Pro");
  // Notification logic
  const requestNotifPermission = async () => {
    if (!("Notification" in window)) {
      alert("Dein Browser unterstuetzt keine Benachrichtigungen.");
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") {
      alert("Benachrichtigungen sind gesperrt. Bitte in den Browser-Einstellungen erlauben.");
      return false;
    }
    const perm = await Notification.requestPermission();
    return perm === "granted";
  };

  const sendTestNotif = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.svg" });
    }
  };

  const handleNotifToggle = async (setter, currentVal, title, body) => {
    if (!currentVal) {
      // Turning ON: request permission first
      const granted = await requestNotifPermission();
      if (!granted) return;
      setter(true);
      sendTestNotif(title, body + " (Testbenachrichtigung)");
    } else {
      setter(false);
    }
    // Persist to localStorage
    const profile = JSON.parse(localStorage.getItem("fudi_user_profile") || "{}");
    localStorage.setItem("fudi_user_profile", JSON.stringify(profile));
  };


  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
          Profil & Einstellungen
        </h1>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        {/* Sidebar nav */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
            {/* Avatar */}
            <div className="p-4 text-center border-b" style={{ borderColor: C.border }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-black text-white" style={{ background: C.forest }}>
                {displayInitial}
              </div>
              <p className="text-sm font-bold" style={{ color: C.forest }}>{displayName}</p>
              <p className="text-xs" style={{ color: C.stone }}>{displayEmail}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: C.mintLight, color: C.forest }}>
                Pro
              </span>
            </div>
            {/* Nav */}
            <div className="py-1">
              {SECTIONS.map((s) => (
                <button key={s} onClick={() => setSection(s)}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{ background: section === s ? C.mintLight : "transparent", color: section === s ? C.forest : C.stone, fontWeight: section === s ? 600 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Profil */}
          {section === "Profil" && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Persoenliche Daten</h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <Field label="Vorname" defaultValue="Max" />
                <Field label="Nachname" defaultValue="Mustermann" />
                <Field label="E-Mail" defaultValue="max@email.de" type="email" />
                <Field label="Telefon" defaultValue="+49 170 123456" />
                <Field label="Geburtsdatum" defaultValue="1990-05-15" type="date" />
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: C.stone }}>Geschlecht</label>
                  <select className="w-full px-3 py-2 rounded-xl text-sm border outline-none" style={{ borderColor: C.border, background: C.white }}>
                    <option>MÃ¤nnlich</option><option>Weiblich</option><option>Divers</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: C.border }}>
                <div>
                  <p className="text-xs" style={{ color: C.stone }}>Avatar</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: C.forest }}>M</div>
                    <button className="text-xs font-semibold" style={{ color: C.mint }}>Bild hochladen</button>
                  </div>
                </div>
                <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: C.forest }}>Speichern</button>
              </div>
            </div>
          )}

          {/* Gesundheit */}
          {section === "Gesundheit" && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Gesundheitsprofil</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Field label="Gewicht (kg)" defaultValue="73.2" type="number" />
                <Field label="GrÃ¶ÃŸe (cm)" defaultValue="180" type="number" />
                <Field label="HbA1c (%)" defaultValue="5.8" type="number" />
                <Field label="Ã˜ Blutzucker (mg/dL)" defaultValue="118" type="number" />
              </div>
              <div className="p-3 rounded-xl mb-4" style={{ background: C.mintLight }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.stone }}>BMI</span>
                  <span className="font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>22.6 â€“ Normal</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: C.stone }}>Diabetes</label>
                <div className="flex gap-2">
                  {["Nein", "Typ 1", "Typ 2", "PrÃ¤diabetes"].map((d) => (
                    <button key={d} className="flex-1 py-2 rounded-lg text-xs font-semibold border"
                      style={{ borderColor: d === "Nein" ? C.forest : C.border, background: d === "Nein" ? C.forest : C.white, color: d === "Nein" ? C.white : C.stone }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ziele */}
          {section === "Ziele" && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
              <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Ziele &amp; Aktivitaet</h2>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2" style={{ color: C.stone }}>Gewichtsziel</label>
                <div className="flex gap-2">
                  {["Abnehmen", "Halten", "Zunehmen"].map((g) => (
                    <button key={g} onClick={() => setGoal(g)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                      style={{ background: goal === g ? C.forest : C.white, color: goal === g ? C.white : C.stone, borderColor: goal === g ? C.forest : C.border }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Field label="Zielgewicht (kg)" defaultValue="70" type="number" />
                <Field label="Proteinziel (g/Tag)" defaultValue="120" type="number" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2" style={{ color: C.stone }}>
                  Aktivitaetslevel: <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>
                    {["Sitzend", "Leicht aktiv", "Moderat", "Sehr aktiv", "Extrem"][activity]}
                  </span>
                </label>
                <input type="range" min={0} max={4} value={activity} onChange={(e) => setActivity(Number(e.target.value))}
                  className="w-full" style={{ accentColor: C.mint }} />
              </div>
              <div className="p-3 rounded-xl" style={{ background: C.mintLight }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.stone }}>Tagesbedarf (TDEE)</span>
                  <span className="font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>2.240 kcal</span>
                </div>
              </div>
            </div>
          )}

          {/* PrÃ¤ferenzen */}
          {section === "Praeferenzen" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
                <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Benachrichtigungen</h2>
                <Toggle label="Mahlzeiten-Erinnerungen" sub="Erinnert dich taeglich ans Essen" val={notifEat} onChange={(v) => handleNotifToggle(setNotifEat, notifEat, "Zeit zu essen!", "Vergiss deine Mahlzeit nicht.")} />
                <Toggle label="Blutzucker messen" sub="Erinnerung nach jeder Mahlzeit" val={notifBs} onChange={(v) => handleNotifToggle(setNotifBs, notifBs, "Blutzucker messen!", "Messe deinen Blutzucker nach der Mahlzeit.")} />
                <Toggle label="Einkaufsliste" sub="Bei niedrigem Vorrat benachrichtigen" val={notifShop} onChange={(v) => handleNotifToggle(setNotifShop, notifShop, "Einkaufsliste!", "Dein Vorrat ist niedrig – Zeit einzukaufen.")} />
                <Toggle label="Woechentlicher Bericht" sub="Jeden Montag deine Stats" val={notifWeekly} onChange={(v) => handleNotifToggle(setNotifWeekly, notifWeekly, "Dein Wochenbericht ist bereit!", "Schau dir deine Stats der letzten Woche an.")} />
              </div>
              <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
                <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Einheiten &amp; Sprache</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: C.stone }}>Blutzucker-Einheit</label>
                    <div className="flex gap-2">
                      {(["mg/dL", "mmol/L"] as const).map((u) => (
                        <button key={u} onClick={() => setUnit(u)} className="flex-1 py-2 rounded-lg text-xs font-semibold border"
                          style={{ background: unit === u ? C.forest : C.white, color: unit === u ? C.white : C.stone, borderColor: unit === u ? C.forest : C.border }}>
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: C.stone }}>Energieeinheit</label>
                    <div className="flex gap-2">
                      {(["kcal", "kJ"] as const).map((u) => (
                        <button key={u} onClick={() => setKcalUnit(u)} className="flex-1 py-2 rounded-lg text-xs font-semibold border"
                          style={{ background: kcalUnit === u ? C.forest : C.white, color: kcalUnit === u ? C.white : C.stone, borderColor: kcalUnit === u ? C.forest : C.border }}>
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Abo */}
          {section === "Abo" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-5" style={{ background: C.forest }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: C.mint }}>Aktueller Plan</p>
                    <p className="text-3xl font-black text-white" style={{ fontFamily: "'DM Sans',sans-serif" }}>Pro</p>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>â‚¬9,90 / Monat Â· NÃ¤chste Abrechnung 1. Okt. 2026</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.mint, color: C.white }}>Aktiv</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
                <h3 className="font-bold mb-3" style={{ color: C.forest }}>Plan verwalten</h3>
                <div className="space-y-2">
                  {["Auf Business upgraden", "Zahlungsmethode Ã¤ndern", "Rechnungen herunterladen", "Abo pausieren"].map((a) => (
                    <button key={a} className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50"
                      style={{ borderColor: C.border, color: C.inkMid }}>
                      {a} â†’
                    </button>
                  ))}
                  <button className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-red-50"
                    style={{ borderColor: "#fca5a5", color: "#D94F3D" }}>
                    Abo kÃ¼ndigen
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Datenschutz */}
          {section === "Datenschutz" && (
            <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: C.border }}>
              <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Datenschutz</h2>
              <p className="text-sm" style={{ color: C.stone }}>Wir nehmen deinen Datenschutz ernst. Hier kannst du deine Daten verwalten.</p>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium"
                  style={{ borderColor: C.border, color: C.inkMid }}>
                  ðŸ“¥ Meine Daten exportieren (JSON / PDF)
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium"
                  style={{ borderColor: C.border, color: C.inkMid }}>
                  ðŸª Cookie-Einstellungen verwalten
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium"
                  style={{ borderColor: C.border, color: C.inkMid }}>
                  ðŸ” Zwei-Faktor-Authentifizierung aktivieren
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-red-50"
                  style={{ borderColor: "#fca5a5", color: "#D94F3D" }}>
                  ðŸ—‘ï¸ Account dauerhaft lÃ¶schen
                </button>
              </div>
              <div className="p-3 rounded-xl text-xs" style={{ background: C.mintLight, color: C.forest }}>
                ðŸ›¡ï¸ Deine Daten werden verschlÃ¼sselt gespeichert und nie an Dritte weitergegeben. DSGVO-konform.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
