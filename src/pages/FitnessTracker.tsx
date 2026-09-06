import { useState } from "react";
import { C } from "../shared/colors";

const WORKOUTS = [
  { id: 1, name: "Krafttraining", icon: "💪", sets: 4, reps: 12, rest: 60, kcal: 320, duration: 45, category: "Kraft", muscles: "Brust, Schultern, Trizeps", steps: ["Warm-up: 5 Min Mobilisation", "Bankdruecken: 4x12 (60 sek Pause)", "Schulterpresse: 3x12", "Trizeps-Pushdown: 3x15", "Cool-down: 5 Min Dehnen"] },
  { id: 2, name: "Jogging 5km", icon: "🏃", sets: 1, reps: 1, rest: 0, kcal: 280, duration: 28, category: "Ausdauer", muscles: "Beine, Herz-Kreislauf", steps: ["Aufwaermen: 2 Min Gehen", "Langsam anlaufen: Pace 6:30/km", "Steady State: 20 Min konstantes Tempo", "Endspurt: letzte 500m schneller", "Abwaermen: 3 Min Gehen + Dehnen"] },
  { id: 3, name: "Yoga & Dehnen", icon: "🧘", sets: 1, reps: 1, rest: 0, kcal: 120, duration: 30, category: "Mobilitaet", muscles: "Ganzkörper, Wirbelsäule", steps: ["Katze-Kuh: 10 Wdh.", "Herabschauender Hund: 60 sek halten", "Krieger I & II: je 30 sek pro Seite", "Sitzende Vorwaertsbeuge: 60 sek", "Savasana: 5 Min Entspannung"] },
  { id: 4, name: "HIIT Circuit", icon: "⚡", sets: 5, reps: 20, rest: 30, kcal: 380, duration: 25, category: "Kraft", muscles: "Ganzkörper, Core", steps: ["Burpees: 20 Wdh. (30 sek Pause)", "Mountain Climbers: 20 Wdh.", "Jump Squats: 20 Wdh.", "Push-ups: 20 Wdh.", "High Knees: 20 Wdh. – 5 Runden gesamt"] },
  { id: 5, name: "Schwimmen 30min", icon: "🏊", sets: 1, reps: 1, rest: 0, kcal: 250, duration: 30, category: "Ausdauer", muscles: "Ganzkörper, Schultern, Rücken", steps: ["Einschwaermen: 2x50m langsam", "Hauptteil Kraul: 10x100m", "Rueckenschwimmen: 4x50m", "Brustschwimmen: 4x50m", "Ausschwaermen: 2x25m locker"] },
  { id: 6, name: "Pilates", icon: "🤸", sets: 1, reps: 1, rest: 0, kcal: 150, duration: 45, category: "Mobilitaet", muscles: "Core, Taille, Beine", steps: ["The Hundred: 100 Pumpbewegungen", "Roll Up: 10 Wdh.", "Single Leg Circle: 5 Wdh. pro Seite", "Rolling Like a Ball: 10 Wdh.", "Plank Variation: 3x30 sek halten"] },
];

const WEEK_WORKOUTS = [
  { day: "Mo", done: true, type: "Kraft", kcal: 320 },
  { day: "Di", done: true, type: "Ausdauer", kcal: 280 },
  { day: "Mi", done: false, type: "Ruhe", kcal: 0 },
  { day: "Do", done: true, type: "Kraft", kcal: 380 },
  { day: "Fr", done: false, type: "Geplant", kcal: 250 },
  { day: "Sa", done: false, type: "Geplant", kcal: 150 },
  { day: "So", done: false, type: "Ruhe", kcal: 0 },
];

const NUTRITION_TIPS = [
  { emoji: "🥤", tip: "Trinke 30min vor dem Training 0,5L Wasser", type: "Hydration" },
  { emoji: "🍌", tip: "Low-GI Snack 1h vor Krafttraining: Banane + Mandeln", type: "Pre-Workout" },
  { emoji: "🥩", tip: "Post-Workout Protein innerhalb 30min: mind. 25g", type: "Post-Workout" },
  { emoji: "🌾", tip: "Komplexe Kohlenhydrate am Abend fuer Muskelregeneration", type: "Recovery" },
];

const CATS = ["Alle", "Kraft", "Ausdauer", "Mobilitaet"];
const CAT_COLORS: Record<string, string> = {
  "Kraft": "#dc2626",
  "Ausdauer": "#2563eb",
  "Mobilitaet": "#16a34a",
};

export default function FitnessTracker() {
  const [selectedCat, setSelectedCat] = useState("Alle");
  const [activeWorkout, setActiveWorkout] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [loggedWorkouts, setLoggedWorkouts] = useState<number[]>([1, 2, 4]);

  const filtered = selectedCat === "Alle" ? WORKOUTS : WORKOUTS.filter(w => w.category === selectedCat);
  const totalKcalBurned = loggedWorkouts.reduce((sum, id) => {
    const w = WORKOUTS.find(w => w.id === id);
    return sum + (w?.kcal || 0);
  }, 0);
  const totalMinutes = loggedWorkouts.reduce((sum, id) => {
    const w = WORKOUTS.find(w => w.id === id);
    return sum + (w?.duration || 0);
  }, 0);

  const toggleLog = (id: number) => {
    setLoggedWorkouts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const startTimer = (workoutId: number) => {
    setActiveWorkout(workoutId);
    setTimer(0);
    setTimerRunning(true);
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    setTimeout(() => clearInterval(interval), 3600000);
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
          Fitness & Training 💪
        </h1>
        <p className="text-sm mt-1" style={{ color: C.stone }}>
          Trainingsplanung, Ernaehrungsanpassung & Kalorienverbrauch
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Einheiten diese Woche", value: loggedWorkouts.length.toString(), unit: "/ 5 Ziel", icon: "🏋️", color: C.forest },
          { label: "Kalorien verbraucht", value: totalKcalBurned.toString(), unit: "kcal", icon: "🔥", color: C.coral },
          { label: "Trainingszeit", value: totalMinutes.toString(), unit: "min", icon: "⏱", color: C.mint },
          { label: "Aktive Tage", value: "3", unit: "/ 7", icon: "📅", color: "#7c3aed" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <span className="text-xs font-medium" style={{ color: C.stone }}>{s.label}</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: s.color }}>{s.value}</span>
              <span className="text-xs mb-1" style={{ color: C.stone }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Workout List */}
        <div className="lg:col-span-2 space-y-4">

          {/* Weekly Overview */}
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>Wochenplan</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {WEEK_WORKOUTS.map((w, i) => (
                <div key={w.day} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold" style={{ color: C.stone }}>{w.day}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{
                      background: w.done ? CAT_COLORS[w.type] || C.mint : w.type === "Ruhe" ? C.border : C.mintLight,
                      color: w.done ? "white" : w.type === "Ruhe" ? C.stone : C.forest
                    }}>
                    {w.done ? "✓" : w.type === "Ruhe" ? "−" : i === 3 ? "!" : "○"}
                  </div>
                  {w.kcal > 0 && <span className="text-[9px]" style={{ color: C.stone }}>{w.kcal}</span>}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t text-xs flex gap-4" style={{ borderColor: C.border }}>
              <span style={{ color: C.stone }}>Streak: <strong style={{ color: C.forest }}>3 Tage</strong></span>
              <span style={{ color: C.stone }}>Ziel: <strong style={{ color: C.forest }}>5 Einheiten</strong></span>
              <span style={{ color: C.stone }}>Gesamt: <strong style={{ color: C.coral }}>{totalKcalBurned} kcal</strong></span>
            </div>
          </div>

          {/* Active Timer */}
          {activeWorkout !== null && (
            <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70 uppercase tracking-wide">Aktives Training</p>
                  <p className="font-bold text-lg">{WORKOUTS.find(w => w.id === activeWorkout)?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{formatTimer(timer)}</p>
                  <button onClick={() => { setActiveWorkout(null); setTimerRunning(false); setTimer(0); }}
                    className="text-xs opacity-70 hover:opacity-100 mt-1">Beenden ✓</button>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex gap-2">
            {CATS.map(c => (
              <button key={c} onClick={() => setSelectedCat(c)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{ background: selectedCat === c ? C.forest : C.white, color: selectedCat === c ? C.white : C.stone, border: `1.5px solid ${selectedCat === c ? C.forest : C.border}` }}>
                {c}
              </button>
            ))}
          </div>

          {/* Workout Cards */}
          <div className="space-y-3">
            {filtered.map(w => {
              const logged = loggedWorkouts.includes(w.id);
              const active = activeWorkout === w.id;
              return (
                <div key={w.id} className="bg-white rounded-2xl border p-4 transition-all"
                  style={{ borderColor: logged ? C.mint : C.border, borderWidth: logged ? 2 : 1 }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: (CAT_COLORS[w.category] || C.mint) + "18" }}>{w.icon}</div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: C.forest }}>{w.name}</p>
                        <div className="flex gap-3 mt-0.5 text-xs" style={{ color: C.stone }}>
                          <span>⏱ {w.duration} min</span>
                          <span>🔥 {w.kcal} kcal</span>
                          {w.sets > 1 && <span>📦 {w.sets}x{w.reps} Wdh.</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: (CAT_COLORS[w.category] || C.mint) + "18", color: CAT_COLORS[w.category] || C.mint }}>
                      {w.category}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: C.border }}>
                    <button onClick={() => active ? setActiveWorkout(null) : startTimer(w.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all"
                      style={{ background: active ? C.coral : C.forest }}>
                      {active ? "⏹ Stoppen" : "▶ Starten"}
                    </button>
                    <button onClick={() => setShowGuide(active ? null : showGuide === w.id ? null : w.id)} className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all" style={{ borderColor: C.border, color: C.forest }}>📋 Anleitung</button>
      <button onClick={() => toggleLog(w.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                      style={{ borderColor: logged ? C.mint : C.border, background: logged ? C.mintLight : "white", color: logged ? C.forest : C.stone }}>
                      {logged ? "✓ Absolviert" : "Als erledigt markieren"}
                    </button>
                  </div>
                  {showGuide === w.id && w.steps && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: C.border }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-sm">💪</span>
                        <p className="text-xs font-bold" style={{ color: C.forest }}>Muskeln: {w.muscles}</p>
                      </div>
                      <ol className="space-y-1">
                        {w.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs" style={{ color: C.inkMid }}>
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5" style={{ background: C.mint }}>{idx + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Nutrition Tips */}
        <div className="space-y-4">
          {/* Calorie Adjustment */}
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>🔥 Kalorien-Anpassung</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl" style={{ background: C.cream }}>
                <span style={{ color: C.stone }}>Grundumsatz (BMR)</span>
                <span className="font-bold" style={{ color: C.forest }}>1.850 kcal</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl" style={{ background: "#fef3c7" }}>
                <span style={{ color: C.stone }}>Trainingsverbrauch</span>
                <span className="font-bold" style={{ color: C.coral }}>+ {totalKcalBurned} kcal</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl font-bold" style={{ background: C.mintLight }}>
                <span style={{ color: C.forest }}>Tagesbedarf gesamt</span>
                <span style={{ color: C.forest }}>{1850 + totalKcalBurned} kcal</span>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: C.forest + "10", color: C.forest }}>
              <strong>Tipp:</strong> Bei Krafttraining 1,6–2g Protein pro kg Koerpergewicht anstreben.
            </div>
          </div>

          {/* Nutrition Tips per Phase */}
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>🥗 Ernaehrungs-Timing</h3>
            <div className="space-y-2.5">
              {NUTRITION_TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl" style={{ background: C.cream }}>
                  <span className="text-lg shrink-0">{tip.emoji}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: C.mint }}>{tip.type}</p>
                    <p className="text-xs leading-snug" style={{ color: C.stone }}>{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplements */}
          <div className="rounded-2xl p-4" style={{ background: C.forest }}>
            <h3 className="text-sm font-bold text-white mb-2">💊 Naehrstoffe bei Training</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { name: "Magnesium", benefit: "Muskelentspannung, Schlaf", dose: "300–400mg abends" },
                { name: "Vitamin D3", benefit: "Knochendichte, Immunsystem", dose: "2000 IE taeglich" },
                { name: "Omega-3", benefit: "Anti-Inflammatorisch", dose: "2g EPA+DHA" },
                { name: "Kreatin", benefit: "+12% Kraft bei Krafttraining", dose: "5g/Tag" },
              ].map(s => (
                <div key={s.name} className="flex items-start justify-between gap-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div>
                    <p className="font-bold text-white">{s.name}</p>
                    <p className="opacity-70 text-white">{s.benefit}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: C.mint + "33", color: C.mint }}>{s.dose}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-3 opacity-50 text-white">Kein Ersatz fuer aerztliche Beratung. Individuelle Dosierung nach Ruecksprache.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
