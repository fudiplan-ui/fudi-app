import { useState } from "react";
import { C } from "../shared/colors";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NUTRI_COLORS: Record<string, string> = {
  A: "#1e8f4e", B: "#86bc25", C: "#fecb02", D: "#ee8100", E: "#e63312",
};

const NOVA_LABELS: Record<number, string> = {
  1: "Unverarbeitet", 2: "Verarbeitete Zutaten", 3: "Verarbeitete Lebensmittel", 4: "Ultra-verarbeitet"
};
const NOVA_COLORS: Record<number, string> = {
  1: "#1e8f4e", 2: "#86bc25", 3: "#ee8100", 4: "#e63312"
};

const DEMO_PRODUCTS: Record<string, { name: string; brand: string; nutriscore: string; nova: number; kcal: number; carbs: number; protein: number; fat: number; sugar: number; fiber: number; ecoscore: string; additives: number }> = {
  "4000417025005": { name: "Wasa Knackebrot", brand: "Wasa", nutriscore: "A", nova: 3, kcal: 352, carbs: 65, protein: 11, fat: 3, sugar: 3, fiber: 14, ecoscore: "B", additives: 0 },
  "4388844058263": { name: "Haferflocken kernig", brand: "Aldi", nutriscore: "A", nova: 1, kcal: 372, carbs: 58, protein: 14, fat: 7, sugar: 1, fiber: 10, ecoscore: "A", additives: 0 },
  "5449000133328": { name: "Coca-Cola Original", brand: "Coca-Cola", nutriscore: "E", nova: 4, kcal: 42, carbs: 10.6, protein: 0, fat: 0, sugar: 10.6, fiber: 0, ecoscore: "D", additives: 5 },
  "8718309294120": { name: "Greek Yogurt 0%", brand: "Fage", nutriscore: "B", nova: 2, kcal: 57, carbs: 4.0, protein: 10, fat: 0.2, sugar: 4.0, fiber: 0, ecoscore: "B", additives: 0 },
};

const DEMO_BARCODES = [
  { code: "4000417025005", label: "Wasa Knackebrot" },
  { code: "4388844058263", label: "Haferflocken (Aldi)" },
  { code: "5449000133328", label: "Coca-Cola" },
  { code: "8718309294120", label: "Fage Greek Yogurt" },
];

interface ProductData {
  name: string; brand: string; nutriscore: string; nova: number;
  kcal: number; carbs: number; protein: number; fat: number;
  sugar: number; fiber: number; ecoscore: string; additives: number;
}

export default function BarcodeScannerModal({ isOpen, onClose }: Props) {
  const [barcode, setBarcode] = useState("");
  const [step, setStep] = useState<"input" | "loading" | "result" | "error">("input");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const lookup = async (code: string) => {
    const trimmed = code.trim().replace(/\D/g, "");
    if (!trimmed) return;
    setStep("loading");
    setProduct(null);
    setErrorMsg("");

    if (DEMO_PRODUCTS[trimmed]) {
      await new Promise(r => setTimeout(r, 800));
      setProduct(DEMO_PRODUCTS[trimmed]);
      setStep("result");
      return;
    }

    try {
      const url = `https://world.openfoodfacts.org/api/v2/product/${trimmed}?fields=product_name,brands,nutriscore_grade,nova_group,nutriments,ecoscore_grade,additives_n`;
      const res = await fetch(url, { headers: { "User-Agent": "FUDI-App/2.0 (contact@fudi.app)" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.status !== 1 || !json.product) {
        throw new Error("Produkt nicht in der Datenbank gefunden.");
      }

      const p = json.product;
      const n = p.nutriments || {};
      setProduct({
        name: p.product_name || "Unbekanntes Produkt",
        brand: p.brands || "Unbekannte Marke",
        nutriscore: (p.nutriscore_grade || "?").toUpperCase(),
        nova: p.nova_group || 0,
        kcal: Math.round(n["energy-kcal_100g"] || (n["energy_100g"] / 4.184) || 0),
        carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
        protein: Math.round((n.proteins_100g || 0) * 10) / 10,
        fat: Math.round((n.fat_100g || 0) * 10) / 10,
        sugar: Math.round((n.sugars_100g || 0) * 10) / 10,
        fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
        ecoscore: (p.ecoscore_grade || "?").toUpperCase(),
        additives: p.additives_n || 0,
      });
      setStep("result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      setErrorMsg(msg.includes("nicht in der") ? msg : "API nicht erreichbar. Bitte Demo-Code verwenden.");
      setStep("error");
    }
  };

  const reset = () => { setStep("input"); setBarcode(""); setProduct(null); setErrorMsg(""); };

  const giEstimate = product ? (product.sugar > 15 ? "Hoch (>70)" : product.sugar > 7 ? "Mittel (55-70)" : "Niedrig (<55)") : "";
  const giColor = product ? (product.sugar > 15 ? C.coral : product.sugar > 7 ? "#f59e0b" : C.mint) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border" style={{ borderColor: C.border }}>
        <div className="p-5 flex items-center justify-between text-white" style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="font-bold text-lg leading-tight">Barcode & NutriScore Scanner</h2>
              <p className="text-xs opacity-80">Open Food Facts - NutriScore A-E - Nova 1-4</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold transition-colors">X</button>
        </div>

        <div className="p-6 space-y-4">
          {step === "input" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: C.stone }}>EAN-Barcode eingeben</label>
                <div className="flex gap-2">
                  <input
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && lookup(barcode)}
                    placeholder="z. B. 4000417025005"
                    className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: C.border, background: "#f9fafb" }}
                  />
                  <button onClick={() => lookup(barcode)} className="px-4 py-2.5 rounded-xl font-bold text-xs text-white" style={{ background: C.forest }}>Suchen</button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <p className="text-xs font-semibold mb-2" style={{ color: C.forest }}>Demo-Codes zum Testen:</p>
                <div className="flex flex-col gap-1.5">
                  {DEMO_BARCODES.map(db => (
                    <button key={db.code} onClick={() => { setBarcode(db.code); lookup(db.code); }}
                      className="flex items-center justify-between text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all hover:border-green-400 hover:bg-green-50"
                      style={{ borderColor: C.border }}>
                      <span style={{ color: C.forest }}>{db.label}</span>
                      <span className="font-mono text-[10px]" style={{ color: C.stone }}>{db.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: C.mint, borderTopColor: "transparent" }} />
              <p className="font-bold text-sm" style={{ color: C.forest }}>Produkt wird gesucht...</p>
              <p className="text-xs" style={{ color: C.stone }}>Open Food Facts API</p>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-center">
                <p className="text-3xl mb-2">😕</p>
                <p className="font-bold text-sm text-red-700">Produkt nicht gefunden</p>
                <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
              </div>
              <button onClick={reset} className="w-full py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: C.forest }}>Anderen Code scannen</button>
            </div>
          )}

          {step === "result" && product && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: C.mintLight }}>🏷️</div>
                <div>
                  <p className="font-black text-sm leading-tight" style={{ color: C.forest }}>{product.name}</p>
                  <p className="text-xs" style={{ color: C.stone }}>{product.brand}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 rounded-xl border" style={{ borderColor: C.border }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: C.stone }}>NutriScore</p>
                  <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white text-xl font-black"
                    style={{ background: NUTRI_COLORS[product.nutriscore] || "#999" }}>{product.nutriscore}</div>
                </div>
                <div className="text-center p-3 rounded-xl border" style={{ borderColor: C.border }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: C.stone }}>Nova</p>
                  <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white text-xl font-black"
                    style={{ background: NOVA_COLORS[product.nova] || "#999" }}>{product.nova}</div>
                  <p className="text-[9px] mt-1" style={{ color: C.stone }}>{NOVA_LABELS[product.nova] || "?"}</p>
                </div>
                <div className="text-center p-3 rounded-xl border" style={{ borderColor: C.border }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: C.stone }}>EcoScore</p>
                  <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white text-xl font-black"
                    style={{ background: NUTRI_COLORS[product.ecoscore] || "#999" }}>{product.ecoscore}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: C.stone }}>Nahrwerte pro 100g</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Kalorien", val: product.kcal + " kcal", color: C.coral },
                    { label: "Kohlenhydr.", val: product.carbs + "g", color: "#f59e0b" },
                    { label: "Zucker", val: product.sugar + "g", color: "#ef4444" },
                    { label: "Protein", val: product.protein + "g", color: C.mint },
                    { label: "Fett", val: product.fat + "g", color: C.stone },
                    { label: "Ballaststoffe", val: product.fiber + "g", color: C.forest },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="text-center">
                      <p className="text-xs font-bold" style={{ fontFamily: "'JetBrains Mono',monospace", color }}>{val}</p>
                      <p className="text-[10px]" style={{ color: C.stone }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: giColor + "18" }}>
                <span className="text-xl">🩸</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: giColor }}>Glykamischer Index: {giEstimate}</p>
                  <p className="text-[11px]" style={{ color: C.stone }}>
                    {product.sugar > 15 ? "Vorsicht: hoher Zuckergehalt - Glukosespitze moglich." :
                      product.sugar > 7 ? "Moderat - mit Protein oder Fett kombinieren." :
                        "Sehr blutzuckerfreundlich - ideal fur Low-GI Ernahrung."}
                  </p>
                </div>
              </div>

              {product.additives > 0 && (
                <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: "#fff7ed", border: "1.5px solid #fed7aa" }}>
                  <span>⚠️</span>
                  <p className="text-xs" style={{ color: "#92400e" }}><strong>{product.additives} Zusatzstoffe</strong> enthalten (E-Nummern)</p>
                </div>
              )}

              <button onClick={reset} className="w-full py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: C.forest }}>Anderen Code scannen</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
