import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { C } from "../shared/colors";
import { IMG } from "../shared/images";
import { useAuth } from "../lib/authContext";
import { estimateTdee } from "../lib/bloodSugar";

const DIET_TYPES = [
  { emoji: "🥗", label: "Vegan" },
  { emoji: "🥕", label: "Vegetarisch" },
  { emoji: "🐟", label: "Pescetarier" },
  { emoji: "🍖", label: "Allesesser" },
  { emoji: "🥩", label: "Keto" },
  { emoji: "🌾", label: "Low-Carb" },
  { emoji: "🫀", label: "Paleo" },
  { emoji: "🫘", label: "Mediterran" },
  { emoji: "⚡", label: "High-Protein" },
  { emoji: "🥛", label: "Laktosefrei" },
  { emoji: "🌿", label: "Glutenfrei" },
  { emoji: "🍱", label: "Flexitarisch" },
];

const ALLERGENS = [
  "Gluten", "Milch", "Eier", "Nuesse", "Erdnuesse",
  "Soja", "Fisch", "Meeresfruchte", "Sellerie",
  "Sesam", "Senf", "Lupinen", "Weichtiere",
];

const CUISINES = [
  "🇩🇪 Deutsch", "🇮🇹 Italienisch", "🇬🇷 Griechisch", "🇹🇷 Tuerkisch",
  "🇲🇽 Mexikanisch", "🇯🇵 Japanisch", "🇰🇷 Koreanisch", "🇨🇳 Chinesisch",
  "🇮🇳 Indisch", "🇹🇭 Thailaendisch", "🇱🇧 Libanesisch", "🇲🇦 Marokkanisch",
  "🇪🇸 Spanisch", "🇫🇷 Franzoesisch", "🇺🇸 Amerikanisch", "🇻🇳 Vietnamesisch",
  "🇵🇪 Peruanisch", "🇪🇹 Aethiopisch",
];

const DIABETES_TYPES = [
  { key: "none", label: "Nein", icon: "✅" },
  { key: "type1", label: "Typ 1", icon: "💉" },
  { key: "type2", label: "Typ 2", icon: "🩸" },
  { key: "pre", label: "Praadiabetes", icon: "⚠️" },
];

function toggleArr<T>(arr: T[], setArr: (v: T[]) => void, val: T): void {
  setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
}

function saveProfile(profile: Record<string, unknown>): void {
  localStorage.setItem("fudi_user_profile", JSON.stringify(profile));
}

interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  tooltip?: string;
}

function Field({ label, type = "text", placeholder, value, onChange, tooltip }: FieldProps) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="block text-sm font-medium" style={{ color: C.forest }}>{label}</label>
        {tooltip && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onClick={() => setShowTip(!showTip)}
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: C.mintLight, color: C.forest }}
            >?</button>
            {showTip && (
              <div className="absolute left-5 top-0 z-30 w-52 text-xs p-2.5 rounded-xl shadow-lg leading-snug" style={{ background: C.forest, color: "#fff" }}>
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
        style={{ borderColor: C.border, background: C.cream, color: C.ink, fontFamily: "'DM Sans', sans-serif" }}
      />
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Google Identity Services nur laden, wenn eine Client-ID konfiguriert ist.
  useEffect(() => {
    if (!clientId) return;
    if (document.querySelector('script[src*="gsi/client"]')) return;
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;
      g.accounts.id.initialize({
        client_id: clientId,
        callback: async (resp: { credential?: string }) => {
          if (!resp.credential) return;
          setBusy(true);
          setNote(null);
          try {
            const payload = JSON.parse(
              atob(resp.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
            );
            const email: string = payload.email || "";
            const secret: string = String(payload.sub || "google-oauth");
            const name: string = payload.given_name || payload.name || email.split("@")[0];
            if (!email) throw new Error("keine E-Mail");
            let r = await login(email, secret);
            if (!r.ok) r = await register(email, secret, name);
            if (r.ok) nav("/dashboard", { replace: true });
            else setNote(r.error || "Google-Anmeldung fehlgeschlagen.");
          } catch {
            setNote("Google-Anmeldung fehlgeschlagen – bitte nutze die E-Mail-Anmeldung.");
          } finally {
            setBusy(false);
          }
        },
      });
      const btn = document.getElementById("fudi-google-btn");
      if (btn) g.accounts.id.renderButton(btn, { theme: "outline", size: "medium", width: 280, text: "continue_with" });
    };
    document.head.appendChild(s);
  }, [clientId, login, register, nav]);

  if (!clientId) {
    // Ehrlicher Zwischenzustand statt eines toten Buttons (alert):
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setNote(note ? null : "info")}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all hover:bg-gray-50 active:scale-95"
          style={{ borderColor: C.border, color: C.inkSoft, background: "#fff", opacity: 0.8 }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.88-6.88C36.05 2.33 30.36 0 24 0 14.62 0 6.52 5.35 2.56 13.16l8.02 6.23C12.34 13.16 17.72 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.52 24.55c0-1.65-.15-3.25-.42-4.78H24v9.05h12.62c-.55 2.94-2.2 5.43-4.67 7.1l7.27 5.65C43.44 37.72 46.52 31.58 46.52 24.55z" />
            <path fill="#FBBC05" d="M10.58 28.61A14.55 14.55 0 0 1 9.5 24c0-1.6.27-3.15.74-4.61L2.22 13.16A23.94 23.94 0 0 0 0 24c0 3.87.93 7.52 2.56 10.72l8.02-6.11z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.92-2.14 15.9-5.83l-7.27-5.65c-2.14 1.43-4.87 2.28-8.63 2.28-6.28 0-11.62-3.68-13.42-8.9l-8.02 6.11C6.52 42.65 14.62 48 24 48z" />
          </svg>
          {busy ? "Anmeldung läuft…" : label}
        </button>
        {note === "info" && (
          <div className="px-3 py-2.5 rounded-xl text-[11px] leading-relaxed" style={{ background: C.cream, color: C.inkMid, border: `1px solid ${C.border}` }}>
            <strong style={{ color: C.forest }}>Google-Anmeldung ist noch nicht aktiviert.</strong> Dafür fehlt eine eigene Google-Client-ID:
            in der Google Cloud Console OAuth-Client erstellen, <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> in{" "}
            <code className="font-mono">Webseite/.env</code> eintragen und neu deployen. Bis dahin funktioniert die Registrierung per
            E-Mail vollständig – auch im Free-Plan.
          </div>
        )}
        {note && note !== "info" && (
          <div className="px-3 py-2 rounded-xl text-[11px] font-semibold" style={{ background: "#D94F3D18", color: C.danger }}>{note}</div>
        )}
      </div>
    );
  }

  // Echte Google-Anmeldung (Client-ID konfiguriert)
  return (
    <div className="space-y-2">
      <div id="fudi-google-btn" className="flex justify-center" />
      {note && (
        <div className="px-3 py-2 rounded-xl text-[11px] font-semibold" style={{ background: "#D94F3D18", color: C.danger }}>{note}</div>
      )}
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await login(email, pw);
      if (!result.ok) {
        setError(result.error || "Anmeldung fehlgeschlagen.");
        return;
      }
      // Bestehendes lokales Profil mit Namen füllen (falls vorhanden)
      const profile = JSON.parse(localStorage.getItem("fudi_user_profile") || "{}");
      if (!profile.name) {
        profile.name = result.session?.name || email.split("@")[0];
        profile.email = result.session?.email || email;
        saveProfile(profile);
      }
      const from = (location.state as { from?: string } | null)?.from;
      nav(from || "/dashboard", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <GoogleButton label="Mit Google anmelden" />
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: C.border }} />
        <span className="text-xs" style={{ color: C.stone }}>oder per E-Mail</span>
        <div className="flex-1 h-px" style={{ background: C.border }} />
      </div>
      {error && (
        <div className="px-3 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#D94F3D18", color: C.danger }}>
          {error}
        </div>
      )}
      <Field label="E-Mail" type="email" placeholder="du@beispiel.de" value={email} onChange={setEmail} />
      <Field label="Passwort" type="password" placeholder="••••••••" value={pw} onChange={setPw} />
      <button
        onClick={handleLogin}
        disabled={busy}
        className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
        style={{ background: C.forest }}
      >
        {busy ? "Wird geprüft…" : "Einloggen →"}
      </button>
      <p className="text-center text-sm" style={{ color: C.stone }}>
        Noch kein Konto?{" "}
        <Link to="/registrieren" className="font-semibold" style={{ color: C.mint }}>Jetzt registrieren</Link>
      </p>
    </div>
  );
}

function RegisterForm() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [diabetes, setDiabetes] = useState("none");
  const [hba1c, setHba1c] = useState("");
  const [dietType, setDietType] = useState("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [activity, setActivity] = useState(2);
  const { bmr, tdee } = estimateTdee(
    Number(weight),
    Number(height),
    Number(birthYear),
    gender as "maennlich" | "weiblich" | "divers" | "",
    activity
  );
  const handleFinish = async () => {
    setBusy(true);
    setFormError(null);
    try {
      const result = await register(email, pw, name);
      if (!result.ok) {
        setFormError(result.error || "Registrierung fehlgeschlagen.");
        setStep(0);
        return;
      }
      saveProfile({ name: result.session?.name || name, email: result.session?.email || email, gender, birthYear, height, weight, diabetes, hba1c, dietType, allergens, cuisines, goal, targetWeight, activity, tdee, createdAt: new Date().toISOString() });
      setStep(4);
    } finally {
      setBusy(false);
    }
  };

  // Validierung Schritt 0 → 1 (Konto-Daten)
  const handleNextFromAccount = () => {
    setFormError(null);
    if (!name.trim()) { setFormError("Bitte gib deinen Vornamen ein."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setFormError("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (pw.length < 8) { setFormError("Das Passwort muss mindestens 8 Zeichen lang sein."); return; }
    setStep(1);
  };
  const stepLabels = ["Konto", "Koerper", "Ernaehrung", "Ziele"];
  return (
    <div>
      {step < 4 && (
        <div className="mb-6">
          <div className="flex gap-1.5 mb-2">
            {stepLabels.map((l, i) => (
              <div key={l} className="flex-1">
                <div className="h-1 rounded-full transition-all" style={{ background: i <= step ? C.mint : C.border }} />
                <p className="text-[9px] mt-1 text-center font-semibold" style={{ color: i <= step ? C.mint : C.stone }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {formError && (
        <div className="px-3 py-2.5 rounded-xl text-xs font-semibold mb-4" style={{ background: "#D94F3D18", color: C.danger }}>
          {formError}
        </div>
      )}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Dein Konto erstellen 👤</h3>
          <GoogleButton label="Schnell mit Google registrieren" />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: C.border }} />
            <span className="text-xs" style={{ color: C.stone }}>oder manuell</span>
            <div className="flex-1 h-px" style={{ background: C.border }} />
          </div>
          <Field label="Dein Vorname" placeholder="z.B. Anna" value={name} onChange={setName} />
          <Field label="E-Mail" type="email" placeholder="du@beispiel.de" value={email} onChange={setEmail} />
          <Field label="Passwort" type="password" placeholder="Mind. 8 Zeichen" value={pw} onChange={setPw} />
        </div>
      )}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Dein Koerper und Gesundheit 💪</h3>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Geschlecht</label>
            <div className="flex gap-2">
              {["maennlich", "weiblich", "divers"].map((g) => (
                <button key={g} type="button" onClick={() => setGender(g)} className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-all capitalize" style={{ borderColor: gender === g ? C.forest : C.border, background: gender === g ? C.forest : C.white, color: gender === g ? C.white : C.stone }}>{g}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Geb.-Jahr" type="number" placeholder="1990" value={birthYear} onChange={setBirthYear} />
            <Field label="Groesse (cm)" type="number" placeholder="170" value={height} onChange={setHeight} />
            <Field label="Gewicht (kg)" type="number" placeholder="70" value={weight} onChange={setWeight} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Hast du Diabetes?</label>
            <div className="grid grid-cols-2 gap-2">
              {DIABETES_TYPES.map((d) => (
                <button key={d.key} type="button" onClick={() => setDiabetes(d.key)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all text-left" style={{ borderColor: diabetes === d.key ? C.mint : C.border, background: diabetes === d.key ? C.mintLight : C.white, color: diabetes === d.key ? C.forest : C.stone }}>
                  <span className="text-base">{d.icon}</span>{d.label}
                </button>
              ))}
            </div>
          </div>
          {diabetes !== "none" && (
            <Field label="HbA1c (%, optional)" type="number" placeholder="z.B. 6.5" value={hba1c} onChange={setHba1c} tooltip="Der HbA1c-Wert zeigt deinen durchschnittlichen Blutzucker der letzten 2-3 Monate. Normal: unter 5,7%. Praediabetes: 5,7-6,4%. Diabetes: 6,5% und hoeher." />
          )}
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Ernaehrungsvorlieben 🥗</h3>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Ernaehrungstyp</label>
            <div className="grid grid-cols-3 gap-2">
              {DIET_TYPES.map((d) => (
                <button key={d.label} type="button" onClick={() => setDietType(d.label)} className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all" style={{ borderColor: dietType === d.label ? C.mint : C.border, background: dietType === d.label ? C.mintLight : C.white, color: dietType === d.label ? C.forest : C.stone }}>
                  <span className="text-xl">{d.emoji}</span>{d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Allergien und Unvertraeglichkeiten</label>
            <div className="flex flex-wrap gap-1.5">
              {ALLERGENS.map((a) => (
                <button key={a} type="button" onClick={() => toggleArr(allergens, setAllergens, a)} className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all" style={{ borderColor: allergens.includes(a) ? C.coral : C.border, background: allergens.includes(a) ? C.coralLight : C.white, color: allergens.includes(a) ? C.coral : C.stone }}>
                  {allergens.includes(a) ? "✕ " : "+ "}{a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Lieblingskuechen (mehrere waehlbar)</label>
            <div className="flex flex-wrap gap-1.5">
              {CUISINES.map((c) => (
                <button key={c} type="button" onClick={() => toggleArr(cuisines, setCuisines, c)} className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all" style={{ borderColor: cuisines.includes(c) ? C.mint : C.border, background: cuisines.includes(c) ? C.mintLight : C.white, color: cuisines.includes(c) ? C.forest : C.stone }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Deine Ziele 🎯</h3>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Gewichtsziel</label>
            <div className="flex gap-2">
              {["Abnehmen", "Halten", "Zunehmen"].map((g) => (
                <button key={g} type="button" onClick={() => setGoal(g)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all" style={{ borderColor: goal === g ? C.forest : C.border, background: goal === g ? C.forest : C.white, color: goal === g ? C.white : C.stone }}>{g}</button>
              ))}
            </div>
          </div>
          <Field label="Zielgewicht (kg)" type="number" placeholder="68" value={targetWeight} onChange={setTargetWeight} />
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>
              Aktivitaetslevel - <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>{["Sitzend", "Leicht aktiv", "Moderat", "Sehr aktiv", "Extrem aktiv"][activity]}</span>
            </label>
            <input type="range" min={0} max={4} value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full" style={{ accentColor: C.mint }} />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: C.stone }}><span>Sitzend</span><span>Extrem aktiv</span></div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: C.mintLight }}>
            <p className="text-xs font-semibold" style={{ color: C.forest }}>Geschaetzter Tagesbedarf (TDEE)</p>
            <p className="text-2xl font-black mt-1" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{(tdee || 2240).toLocaleString("de-DE")} kcal</p>
            {bmr > 0 && <p className="text-[11px] mt-0.5" style={{ color: C.stone }}>Grundumsatz (BMR): {bmr} kcal</p>}
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="text-center py-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>{name ? `Willkommen, ${name}!` : "Profil erstellt!"}</h3>
          <p className="text-sm mb-6" style={{ color: C.stone }}>Dein persoenliches FUDI-Profil ist fertig. Dein Dashboard wartet auf dich.</p>
          <button type="button" onClick={() => nav("/dashboard")} className="px-8 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-95" style={{ background: C.forest }}>Zum Dashboard →</button>
        </div>
      )}
      {step < 4 && (
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: C.border, color: C.stone }}>Zurueck</button>
          )}
          <button type="button" onClick={() => step === 3 ? handleFinish() : step === 0 ? handleNextFromAccount() : setStep(step + 1)} disabled={busy} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60" style={{ background: C.forest }}>
            {step === 3 ? (busy ? "Konto wird erstellt…" : "Profil erstellen") : "Weiter →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Login({ mode = "login" }) {
  return (
    <div className="min-h-screen flex" style={{ background: C.cream }}>
      <div className="hidden lg:flex flex-col w-[45%] relative overflow-hidden" style={{ background: C.forest }}>
        <img src={IMG.heroSalad} alt="Gesundes Essen" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 p-10 flex flex-col h-full">
          <Link to="/" className="text-2xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.mint, letterSpacing: "-0.04em" }}>FUDI</Link>
          <div className="flex-1 flex flex-col justify-center">
            <blockquote className="text-white text-2xl font-semibold leading-snug mb-4" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              "FUDI hat mir geholfen, meinen Blutzucker um 30% zu verbessern durch smarte Rezeptauswahl."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: C.mint }}>M</div>
              <div>
                <p className="text-sm font-semibold text-white">Maria S.</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>FUDI Pro Nutzerin seit 2025</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i === 0 ? C.mint : "rgba(255,255,255,0.3)" }} />)}</div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-black mb-1" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
              {mode === "login" ? "Willkommen zurueck" : "Konto erstellen"}
            </h1>
            <p className="text-sm" style={{ color: C.stone }}>
              {mode === "login" ? "Logge dich in dein FUDI-Konto ein." : "Erstelle dein persoenliches Ernaehrungsprofil."}
            </p>
          </div>
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return <Login mode="register" />;
}