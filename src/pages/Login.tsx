import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { C } from "../shared/colors";
import { IMG } from "../shared/images";

// ── Shared input ──────────────────────────────────────────────────
function Field({ label, type = "text", placeholder, icon }: { label: string; type?: string; placeholder?: string; icon?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: C.forest }}>{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{
            paddingLeft: icon ? 36 : 12,
            border: `1.5px solid ${focused ? C.mint : C.border}`,
            background: focused ? C.white : C.cream,
            color: C.ink,
          }}
        />
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────
function LoginForm() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <Field label="E-Mail" type="email" placeholder="deine@email.de" icon="✉" />
      <Field label="Passwort" type="password" placeholder="••••••••" icon="🔒" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: C.stone }}>
          <input type="checkbox" className="rounded" />
          Angemeldet bleiben
        </label>
        <a href="#" className="text-sm font-medium" style={{ color: C.mint }}>Passwort vergessen?</a>
      </div>
      <button
        onClick={() => nav("/dashboard")}
        className="w-full py-3 rounded-xl text-white font-bold text-sm mt-2 hover:opacity-90 transition-opacity"
        style={{ background: C.forest }}
      >
        Einloggen
      </button>
      <button className="w-full py-3 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 flex items-center justify-center gap-2" style={{ borderColor: C.border, color: C.inkMid }}>
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Mit Google anmelden
      </button>
      <p className="text-center text-sm" style={{ color: C.stone }}>
        Noch kein Konto?{" "}
        <Link to="/register" className="font-semibold" style={{ color: C.mint }}>Registrieren</Link>
      </p>
    </div>
  );
}

// ── REGISTER (multi-step) ─────────────────────────────────────────
const DIET_TYPES = [
  { icon: "🥗", label: "Vegan" },
  { icon: "🥕", label: "Vegetarisch" },
  { icon: "🐟", label: "Pescetarier" },
  { icon: "🍖", label: "Allesesser" },
];

const ALLERGENS = ["Gluten", "Laktose", "Nüsse", "Soja", "Eier", "Fisch", "Schalentiere"];
const CUISINES  = ["Mediterran", "Asiatisch", "Deutsch", "Mexikanisch", "Japanisch", "Indisch", "Italienisch"];

function RegisterForm() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [diet, setDiet] = useState("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [goal, setGoal] = useState("Halten");
  const [activity, setActivity] = useState(2);

  const STEPS = ["Basisdaten", "Gesundheit", "Ernährung", "Ziele", "Fertig"];

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-1.5 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full h-1 rounded-full transition-all"
              style={{ background: i < step ? C.mint : i === step - 1 ? C.forest : C.border }}
            />
            <span className="text-[9px]" style={{ color: i === step - 1 ? C.forest : C.stone }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Basis */}
      {step === 1 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Willkommen bei FUDI 👋</h3>
          <Field label="Vorname" placeholder="Max" />
          <Field label="E-Mail" type="email" placeholder="max@email.de" icon="✉" />
          <Field label="Passwort" type="password" placeholder="Mindestens 8 Zeichen" icon="🔒" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Geburtsdatum" type="date" />
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.forest }}>Geschlecht</label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ borderColor: C.border, background: C.cream, color: C.ink }}>
                <option>Männlich</option><option>Weiblich</option><option>Divers</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Health */}
      {step === 2 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Gesundheitsprofil 🩺</h3>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Hast du Diabetes?</label>
            <div className="flex gap-3">
              {["Nein", "Typ 1", "Typ 2", "Prädiabetes"].map((d) => (
                <button key={d} className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-all" style={{ borderColor: C.mint, color: C.forest, background: C.mintLight }}>{d}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Gewicht (kg)" type="number" placeholder="70" />
            <Field label="Größe (cm)" type="number" placeholder="175" />
          </div>
          <div className="p-3 rounded-xl text-sm" style={{ background: C.mintLight, color: C.forest }}>
            BMI: <span className="font-black font-mono">22.9</span> – Normal ✓
          </div>
          <Field label="HbA1c (%, optional)" type="number" placeholder="5.8" />
          <Field label="Ø Blutzucker (mg/dL, optional)" type="number" placeholder="112" />
        </div>
      )}

      {/* Step 3: Nutrition */}
      {step === 3 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Ernährungsvorlieben 🥗</h3>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Ernährungstyp</label>
            <div className="grid grid-cols-2 gap-2">
              {DIET_TYPES.map((d) => (
                <button
                  key={d.label}
                  onClick={() => setDiet(d.label)}
                  className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    borderColor: diet === d.label ? C.mint : C.border,
                    background: diet === d.label ? C.mintLight : C.white,
                    color: C.forest,
                  }}
                >
                  <span>{d.icon}</span>{d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Allergien & Unverträglichkeiten</label>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleArr(allergens, setAllergens, a)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={{
                    borderColor: allergens.includes(a) ? C.coral : C.border,
                    background: allergens.includes(a) ? C.coralLight : C.white,
                    color: allergens.includes(a) ? C.coral : C.stone,
                  }}
                >
                  {allergens.includes(a) ? "✕ " : "+ "}{a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Lieblingsküchen</label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleArr(cuisines, setCuisines, c)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={{
                    borderColor: cuisines.includes(c) ? C.mint : C.border,
                    background: cuisines.includes(c) ? C.mintLight : C.white,
                    color: cuisines.includes(c) ? C.forest : C.stone,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Goals */}
      {step === 4 && (
        <div className="flex flex-col gap-5 animate-fade-in">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Deine Ziele 🎯</h3>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>Gewichtsziel</label>
            <div className="flex gap-2">
              {["Abnehmen", "Halten", "Zunehmen"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    borderColor: goal === g ? C.forest : C.border,
                    background: goal === g ? C.forest : C.white,
                    color: goal === g ? C.white : C.stone,
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <Field label="Zielgewicht (kg)" type="number" placeholder="68" />
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.forest }}>
              Aktivitätslevel – <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>
                {["Sitzend", "Leicht aktiv", "Moderat", "Sehr aktiv", "Extrem aktiv"][activity]}
              </span>
            </label>
            <input
              type="range" min={0} max={4} value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="w-full accent-mint"
              style={{ accentColor: C.mint }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: C.stone }}>
              <span>Sitzend</span><span>Extrem aktiv</span>
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: C.mintLight }}>
            <p className="text-xs font-semibold" style={{ color: C.forest }}>Geschätzter Tagesbedarf (TDEE)</p>
            <p className="text-2xl font-black mt-1" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>2.240 kcal</p>
          </div>
        </div>
      )}

      {/* Step 5: Done */}
      {step === 5 && (
        <div className="text-center py-6 animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Profil erstellt!</h3>
          <p className="text-sm mb-6" style={{ color: C.stone }}>Willkommen bei FUDI. Dein persönliches Dashboard wartet auf dich.</p>
          <button onClick={() => nav("/dashboard")} className="px-8 py-3 rounded-xl text-white font-bold" style={{ background: C.forest }}>
            Zum Dashboard →
          </button>
        </div>
      )}

      {/* Navigation */}
      {step < 5 && (
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: C.border, color: C.stone }}>
              Zurück
            </button>
          )}
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: C.forest }}
          >
            {step === 4 ? "Profil erstellen" : "Weiter →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function Login({ mode = "login" }: { mode?: "login" | "register" }) {
  return (
    <div className="min-h-screen flex" style={{ background: C.cream }}>
      {/* Left: image panel */}
      <div className="hidden lg:flex flex-col w-[45%] relative overflow-hidden" style={{ background: C.forest }}>
        <img
          src={IMG.heroSalad}
          alt="Gesundes Essen"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-10 flex flex-col h-full">
          <Link to="/" className="text-2xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.mint, letterSpacing: "-0.04em" }}>FUDI</Link>
          <div className="flex-1 flex flex-col justify-center">
            <blockquote className="text-white text-2xl font-semibold leading-snug mb-4" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              "FUDI hat mir geholfen, meinen Blutzucker um 30% zu verbessern – durch smarte Rezeptauswahl."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: C.mint }}>M</div>
              <div>
                <p className="text-sm font-semibold text-white">Maria S.</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>FUDI Pro Nutzerin seit 2025</p>
              </div>
            </div>
          </div>
          {/* Decorative dots */}
          <div className="flex gap-2">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i === 0 ? C.mint : "rgba(255,255,255,0.3)" }} />)}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-1" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
              {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
            </h1>
            <p className="text-sm" style={{ color: C.stone }}>
              {mode === "login" ? "Logge dich in dein FUDI-Konto ein." : "Erstelle dein persönliches Ernährungsprofil."}
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
