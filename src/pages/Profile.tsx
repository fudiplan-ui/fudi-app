import { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";

const SECTIONS = ["Profil", "Gesundheit", "Ziele", "Präferenzen", "Abo", "Business & API", "Datenschutz"];

export default function Profile() {
  const [section, setSection] = useState("Profil");
  const [name, setName] = useState("Max Mustermann");
  const [email, setEmail] = useState("max@example.com");
  const [age, setAge] = useState("32");
  const [weight, setWeight] = useState("78");
  const [height, setHeight] = useState("182");
  const [activity, setActivity] = useState("moderat");
  const [diets, setDiets] = useState<string[]>(["Low GI", "High Protein"]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [goal, setGoal] = useState("Muskelaufbau & Glukosestabilität");
  const [unit, setUnit] = useState("mg/dL");
  const [savedToast, setSavedToast] = useState(false);

  // Business & API State
  const [apiKey, setApiKey] = useState("fudi_live_9a7d8c6b2e1f483a99e0123");
  const [keyCopied, setKeyCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.ihre-praxis.de/fudi-webhook");
  const [apiEndpointSelected, setApiEndpointSelected] = useState("recipes");

  const toggleDiet = (d: string) => {
    setDiets(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const toggleAllergy = (a: string) => {
    setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = "fudi_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    alert("Neuer Produktions-API-Schlüssel generiert!");
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: C.sandLight }}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Mein FUDI Profil & Einstellungen
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              Verwalte deine metabolischen Parameter, Ernährungsformen, dein Abo und B2B API-Zugänge.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md bg-emerald-800 hover:bg-emerald-900 transition-all"
          >
            Änderungen speichern
          </button>
        </div>

        {savedToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-xs md:text-sm font-bold shadow-2xl flex items-center gap-2 bg-emerald-800 animate-bounce">
            <span>✅</span> Einstellungen erfolgreich gespeichert!
          </div>
        )}

        {/* Section Navigation */}
        <div className="flex border-b text-xs font-bold overflow-x-auto bg-white p-2 rounded-2xl border shadow-xs" style={{ borderColor: C.border }}>
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                section === s
                  ? "bg-emerald-800 text-white font-black shadow-xs"
                  : "text-slate-600 hover:bg-gray-100 font-semibold"
              }`}
            >
              {s === "Business & API" ? "💼 Business & API" : s}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border shadow-sm space-y-6" style={{ borderColor: C.border }}>
          
          {/* 1. PROFIL */}
          {section === "Profil" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Persönliche Angaben</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vollständiger Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-Mail-Adresse</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alter</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Körpergewicht (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. GESUNDHEIT & METABOLIK */}
          {section === "Gesundheit" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Metabolische Parameter & Blutzucker-Einheit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bevorzugte Blutzuckereinheit</label>
                  <div className="flex gap-2">
                    {["mg/dL", "mmol/L"].map(u => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          unit === u ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-600 hover:bg-gray-100"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aktivitätsniveau</label>
                  <select
                    value={activity}
                    onChange={e => setActivity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white text-slate-700 font-semibold"
                  >
                    <option value="sedentaer">Sedentär (überwiegend sitzend)</option>
                    <option value="moderat">Moderat (2–3x Sport / Woche)</option>
                    <option value="aktiv">Sehr aktiv (4–6x Training / Woche)</option>
                    <option value="leistung">Leistungssportler (&gt;7x Training)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. ZIELE */}
          {section === "Ziele" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Dein Hauptziel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: "Glukose-Stabilität & Anti-Heißhunger", desc: "Verhindert Nachmittagstiefs und Insulinkicks." },
                  { title: "Nachhaltiger Fettabbau (Keto / Low-Carb)", desc: "Aktiviert den zellulären Fettstoffwechsel." },
                  { title: "Muskelaufbau & Hypertrophie", desc: "Maximale Proteinsynthese bei stabiler Insulinsensitivität." },
                  { title: "Mikrobiom & Darmgesundheit", desc: "Schwerpunkt auf resistente Stärke & Präbiotika." },
                ].map(g => (
                  <div
                    key={g.title}
                    onClick={() => setGoal(g.title)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      goal === g.title
                        ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                        : "bg-gray-50/70 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">{g.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PRÄFERENZEN & ALLERGIEN */}
          {section === "Präferenzen" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Bevorzugte Ernährungsformen</h3>
                <div className="flex flex-wrap gap-2">
                  {["Low GI", "High Protein", "Keto", "Low Carb", "Vegan", "Vegetarisch", "Glutenfrei", "Paleo"].map(d => (
                    <button
                      key={d}
                      onClick={() => toggleDiet(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        diets.includes(d) ? "bg-emerald-800 text-white border-emerald-900" : "bg-gray-50 text-slate-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {diets.includes(d) ? "✓ " : "+ "}{d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Allergene ausschließen</h3>
                <div className="flex flex-wrap gap-2">
                  {["Gluten", "Laktose", "Fisch", "Krebstiere", "Erdnüsse", "Schalenfrüchte", "Soja", "Histamin"].map(a => (
                    <button
                      key={a}
                      onClick={() => toggleAllergy(a)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        allergies.includes(a) ? "bg-rose-700 text-white border-rose-800" : "bg-gray-50 text-slate-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {allergies.includes(a) ? "✕ " : "+ "}{a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. ABO */}
          {section === "Abo" && (
            <div className="space-y-4">
              <div className="rounded-3xl p-6 bg-slate-900 text-white flex flex-col md:flex-row items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Aktiver Plan
                  </span>
                  <h3 className="text-2xl font-black mt-1">FUDI Business & Praxis Pro</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Voller API-Zugriff, 1.240 Rezepte, unbegrenzte Kundenprofile & Barcode-Integration.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-emerald-400">29,90 €</span>
                  <span className="text-xs text-slate-400 block">/ Monat zzgl. MwSt.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setSection("Business & API")}
                  className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 font-bold text-xs text-slate-800 flex items-center justify-between"
                >
                  <span>🔑 Zum B2B API Dashboard & Schlüsseln</span>
                  <span>›</span>
                </button>
                <Link
                  to="/preise"
                  className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 font-bold text-xs text-slate-800 flex items-center justify-between"
                >
                  <span>💳 Zahlungsart & Rechnungen verwalten</span>
                  <span>›</span>
                </Link>
              </div>
            </div>
          )}

          {/* 6. BUSINESS & API (Full B2B Hub) */}
          {section === "Business & API" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-base font-bold text-slate-900">FUDI Business API Hub</h2>
                <p className="text-xs text-slate-500">
                  Verbinde FUDI mit deiner Praxissoftware, Fitness-App oder deinem Firmenfitness-Portal.
                </p>
              </div>

              {/* API Key Box */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Dein Produktions-API-Schlüssel (Live)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Status: Aktiv (100.000 Calls/Mo)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    readOnly
                    className="flex-1 px-3.5 py-2 rounded-xl border text-xs font-mono bg-white text-slate-800"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5 shrink-0"
                  >
                    <span>{keyCopied ? "✓ Kopiert!" : "📋 Kopieren"}</span>
                  </button>
                  <button
                    onClick={handleRegenerateKey}
                    className="px-3 py-2 rounded-xl text-xs font-bold border bg-white hover:bg-gray-100 text-slate-700 shrink-0"
                  >
                    Neu generieren
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  ⚠️ Halte deinen Schlüssel geheim. Nutze ihn nur in Server-zu-Server Requests (Header: <code>Authorization: Bearer fudi_live_...</code>).
                </p>
              </div>

              {/* Quota & Usage Gauge */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-2xl border border-gray-100 bg-white">
                  <p className="text-[10px] text-gray-500">Monatliche Anfragen</p>
                  <p className="text-base font-black font-mono text-slate-900 mt-0.5">14.820 / 100.000</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: "14.8%" }} />
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-gray-100 bg-white">
                  <p className="text-[10px] text-gray-500">Ø Latenz (P95)</p>
                  <p className="text-base font-black font-mono text-emerald-700 mt-0.5">38 ms</p>
                  <p className="text-[10px] text-emerald-600 mt-1">✓ Hochverfügbar</p>
                </div>
                <div className="p-3.5 rounded-2xl border border-gray-100 bg-white">
                  <p className="text-[10px] text-gray-500">Verknüpfte Mandanten</p>
                  <p className="text-base font-black font-mono text-slate-900 mt-0.5">24 Kunden</p>
                  <p className="text-[10px] text-gray-400 mt-1">Multi-Tenant</p>
                </div>
              </div>

              {/* Interactive Endpoint Explorer */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Interaktiver Endpoint-Explorer
                </h3>
                <div className="flex gap-2">
                  {[
                    { id: "recipes", label: "GET /api/v1/recipes" },
                    { id: "glucose", label: "POST /api/v1/glucose-impact" },
                    { id: "plan",    label: "POST /api/v1/meal-plan/generate" }
                  ].map(ep => (
                    <button
                      key={ep.id}
                      onClick={() => setApiEndpointSelected(ep.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        apiEndpointSelected === ep.id ? "bg-slate-900 text-white" : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                      }`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>

                {/* Endpoint Code preview */}
                <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-gray-800">
                  {apiEndpointSelected === "recipes" && (
                    <pre>{`// cURL Beispiel
curl -X GET "https://api.fudi.de/v1/recipes?diet=keto&limit=5" \\
  -H "Authorization: Bearer ${apiKey}"

// Response (200 OK)
{
  "status": "success",
  "count": 5,
  "data": [
    { "id": "1", "title": "Wildlachsfilet mit Brokkoli", "kcal": 490, "gi": "low", "impact_mg_dl": 14 }
  ]
}`}</pre>
                  )}
                  {apiEndpointSelected === "glucose" && (
                    <pre>{`// POST Glukose-Simulation
curl -X POST "https://api.fudi.de/v1/glucose-impact" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"food": "Helle Pasta", "start_bs": 105, "swap": "Konjak-Nudeln"}'

// Response (200 OK)
{
  "original_peak": 159,
  "optimized_peak": 113,
  "saved_delta_mg_dl": 46
}`}</pre>
                  )}
                  {apiEndpointSelected === "plan" && (
                    <pre>{`// POST Automatischer Wochenplan
curl -X POST "https://api.fudi.de/v1/meal-plan/generate" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"diet": "High Protein", "days": 7, "kcal_target": 2200}'

// Response (200 OK): Erstellt 28 personalisierte Mahlzeiten`}</pre>
                  )}
                </div>
              </div>

              {/* Webhook Settings */}
              <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
                <h3 className="text-xs font-bold text-slate-700">Webhook-Integration (Echtzeit-Events)</h3>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border text-xs font-mono bg-gray-50 focus:bg-white"
                />
                <p className="text-[10px] text-slate-500">
                  Events: <code>user.meal_logged</code>, <code>glucose.spike_detected</code>, <code>workout.completed</code>.
                </p>
              </div>
            </div>
          )}

          {/* 7. DATENSCHUTZ */}
          {section === "Datenschutz" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Datenschutz & DSGVO-Rechte</h2>
              <p className="text-xs text-slate-600">
                Deine Gesundheitsdaten gehören ausschließlich dir und werden niemals an Dritte verkauft.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => alert("Datenexport als JSON wird vorbereitet...")}
                  className="w-full text-left px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>📥 Vollständigen Datenexport anfordern (JSON / CSV)</span>
                  <span>›</span>
                </button>
                <button
                  onClick={() => alert("Cookie-Präferenzen gespeichert.")}
                  className="w-full text-left px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>🍪 Cookie- & Tracking-Einstellungen anpassen</span>
                  <span>›</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm("Möchtest du deinen Account und alle gespeicherten Daten wirklich unwiderruflich löschen?")) {
                      localStorage.clear();
                      alert("Account erfolgreich gelöscht.");
                      window.location.href = "/";
                    }
                  }}
                  className="w-full text-left px-4 py-3 rounded-2xl border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center justify-between"
                >
                  <span>🗑️ Account und alle Daten dauerhaft löschen</span>
                  <span>›</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
