import React, { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_INGREDIENTS = [
  { name: "Babyspinat", expiry: "Morgen", urgent: true, icon: "🥬" },
  { name: "Kirschtomaten", expiry: "2 Tage", urgent: true, icon: "🍅" },
  { name: "Eier", expiry: "5 Tage", urgent: false, icon: "🥚" },
  { name: "Feta", expiry: "6 Tage", urgent: false, icon: "🧀" },
  { name: "Quinoa", expiry: "Lange haltbar", urgent: false, icon: "🌾" },
  { name: "Lachs (Filet)", expiry: "Heute", urgent: true, icon: "🐟" },
];

export default function FridgeScannerModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<"upload" | "scanning" | "results">("upload");
  const [selectedItems, setSelectedItems] = useState<string[]>([
    "Babyspinat",
    "Kirschtomaten",
    "Feta",
  ]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setStep("scanning");
    setTimeout(() => {
      setStep("results");
    }, 1200);
  };

  const toggleItem = (name: string) => {
    if (selectedItems.includes(name)) {
      setSelectedItems(selectedItems.filter((i) => i !== name));
    } else {
      setSelectedItems([...selectedItems, name]);
    }
  };

  // Find matching recipes
  const matchedRecipes = RECIPES.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border"
        style={{ borderColor: C.border }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between text-white"
          style={{ background: C.forest }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📸</span>
            <div>
              <h2 className="font-bold text-lg leading-tight">
                Kühlschrank & Vorrats-Scanner
              </h2>
              <p className="text-xs opacity-80">
                KI-gestützte No-Waste Rezepterkennung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "upload" && (
            <div className="text-center space-y-4">
              <div
                className="border-2 border-dashed rounded-2xl p-8 cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ borderColor: C.mint }}
                onClick={handleSimulateScan}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl" style={{ background: C.mintLight }}>
                  📷
                </div>
                <p className="font-bold text-sm" style={{ color: C.forest }}>
                  Foto vom Kühlschrank oder Vorratsschrank
                </p>
                <p className="text-xs mt-1" style={{ color: C.stone }}>
                  Klicke hier zum Hochladen oder Test-Scan starten
                </p>
              </div>

              <div className="text-left bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold mb-2" style={{ color: C.forest }}>
                  ⚡ Schnellauswahl aus deinem Inventar:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_INGREDIENTS.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => toggleItem(item.name)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        selectedItems.includes(item.name)
                          ? "bg-green-100 border-green-400 text-green-800"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      {item.icon} {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSimulateScan}
                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 shadow-sm"
                style={{ background: C.mint }}
              >
                Scan starten & Rezepte finden ➔
              </button>
            </div>
          )}

          {step === "scanning" && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: C.mint, borderTopColor: "transparent" }} />
              <p className="font-bold" style={{ color: C.forest }}>
                Hermes Vision KI analysiert deine Zutaten...
              </p>
              <p className="text-xs" style={{ color: C.stone }}>
                Erkenne Frischegrad, Nährstoffe & Glykämischen Index
              </p>
            </div>
          )}

          {step === "results" && (
            <div className="space-y-4">
              {/* EcoPoints Banner */}
              <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: C.mintLight }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: C.forest }}>
                      No-Waste Score: 94%
                    </p>
                    <p className="text-[11px]" style={{ color: C.stone }}>
                      Du rettest ca. 350g Lebensmittel vor dem Verfall!
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: C.forest }}>
                  +25 EcoPoints
                </span>
              </div>

              {/* Matched Recipes */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.stone }}>
                  Passende Rezepte mit deinen Zutaten:
                </p>
                <div className="space-y-2">
                  {matchedRecipes.map((r, i) => (
                    <Link
                      key={r.id}
                      to={`/rezepte/${r.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 rounded-xl border hover:shadow-md transition-all group"
                      style={{ borderColor: C.border }}
                    >
                      <img
                        src={r.img}
                        alt={r.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-green-700" style={{ color: C.forest }}>
                          {r.title}
                        </p>
                        <p className="text-[11px]" style={{ color: C.stone }}>
                          ⏱ {r.time} min • {r.kcal} kcal • {i === 0 ? "4/4" : "3/4"} Zutaten vorhanden
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: C.mintLight, color: C.forest }}>
                        Kochen ➔
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep("upload")}
                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                ← Anderes Foto scannen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
