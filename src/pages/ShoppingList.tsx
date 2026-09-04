import { useState } from "react";
import { C } from "../shared/colors";

type Item = { id: number; name: string; amount: string; price: number; category: string; checked: boolean };

const INITIAL_ITEMS: Item[] = [
  { id:1,  name: "Quinoa",          amount: "400g",    price: 2.99, category: "Vorräte",      checked: false },
  { id:2,  name: "Avocado",         amount: "3 Stück", price: 2.49, category: "Obst & Gemüse",checked: true  },
  { id:3,  name: "Kichererbsen",    amount: "2×400g",  price: 1.98, category: "Vorräte",      checked: false },
  { id:4,  name: "Babyspinat",      amount: "200g",    price: 1.79, category: "Obst & Gemüse",checked: false },
  { id:5,  name: "Kirschtomaten",   amount: "500g",    price: 1.49, category: "Obst & Gemüse",checked: false },
  { id:6,  name: "Rote Paprika",    amount: "3 Stück", price: 1.97, category: "Obst & Gemüse",checked: true  },
  { id:7,  name: "Lachs (Filet)",   amount: "600g",    price: 8.99, category: "Fleisch & Fisch",checked: false},
  { id:8,  name: "Griechischer Joghurt",amount:"500g", price: 1.99, category: "Molkerei",     checked: false },
  { id:9,  name: "Haferflocken",    amount: "500g",    price: 1.29, category: "Vorräte",      checked: false },
  { id:10, name: "Blaubeeren",      amount: "250g",    price: 2.49, category: "Obst & Gemüse",checked: false },
  { id:11, name: "Mandeln",         amount: "200g",    price: 2.99, category: "Vorräte",      checked: true  },
  { id:12, name: "Olivenöl",        amount: "500ml",   price: 4.49, category: "Vorräte",      checked: false },
  { id:13, name: "Tahini",          amount: "250g",    price: 3.49, category: "Vorräte",      checked: false },
  { id:14, name: "Feta",            amount: "200g",    price: 2.29, category: "Molkerei",     checked: false },
  { id:15, name: "Tiefkühl-Erbsen", amount: "600g",    price: 1.79, category: "Tiefkühl",    checked: false },
];

const CATS = ["Alle", "Obst & Gemüse", "Fleisch & Fisch", "Molkerei", "Vorräte", "Tiefkühl"];

const CAT_ICONS: Record<string, string> = {
  "Obst & Gemüse":   "🥦",
  "Fleisch & Fisch": "🐟",
  "Molkerei":        "🧀",
  "Vorräte":         "🫙",
  "Tiefkühl":        "❄️",
};

export default function ShoppingList() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cat, setCat]     = useState("Alle");
  const [newName, setNewName] = useState("");
  const [newAmt, setNewAmt]   = useState("");

  const toggle = (id: number) => setItems(items.map((it) => it.id === id ? { ...it, checked: !it.checked } : it));
  const remove = (id: number) => setItems(items.filter((it) => it.id !== id));
  const addItem = () => {
    if (!newName.trim()) return;
    setItems([...items, {
      id: Date.now(),
      name: newName.trim(),
      amount: newAmt || "1×",
      price: 0,
      category: cat === "Alle" ? "Vorräte" : cat,
      checked: false,
    }]);
    setNewName(""); setNewAmt("");
  };

  const filtered = cat === "Alle" ? items : items.filter((it) => it.category === cat);
  const total    = items.filter((it) => !it.checked).reduce((s, it) => s + it.price, 0);
  const done     = items.filter((it) => it.checked).length;
  const pct      = Math.round((done / items.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Einkaufsliste 🛒
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.stone }}>{done} von {items.length} eingekauft</p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-3 py-2 rounded-xl border font-semibold" style={{ borderColor: C.border, color: C.stone }}>Teilen ↗</button>
          <button className="text-xs px-3 py-2 rounded-xl text-white font-semibold" style={{ background: C.forest }}>PDF ↓</button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border p-4 mb-4" style={{ borderColor: C.border }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: C.stone }}>Fortschritt</span>
          <span className="font-bold" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: C.border }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? C.mint : C.coral }} />
        </div>
        <div className="flex justify-between mt-3">
          <div className="text-center">
            <p className="text-xs" style={{ color: C.stone }}>Artikel</p>
            <p className="font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{items.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: C.stone }}>Noch zu kaufen</p>
            <p className="font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.coral }}>{items.length - done}</p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: C.stone }}>Geschätzte Kosten</p>
            <p className="font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>€{total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ background: cat === c ? C.forest : C.white, color: cat === c ? C.white : C.stone, border: `1.5px solid ${cat === c ? C.forest : C.border}` }}>
            {CAT_ICONS[c] || "📋"} {c}
          </button>
        ))}
      </div>

      {/* Add item */}
      <div className="flex gap-2 mb-4">
        <input
          value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="Artikel hinzufügen…"
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm border outline-none"
          style={{ borderColor: C.border, background: C.white }}
        />
        <input
          value={newAmt} onChange={(e) => setNewAmt(e.target.value)}
          placeholder="Menge"
          className="w-20 px-3 py-2.5 rounded-xl text-sm border outline-none"
          style={{ borderColor: C.border, background: C.white }}
        />
        <button onClick={addItem} className="px-3 py-2.5 rounded-xl text-white font-bold text-sm" style={{ background: C.mint }}>+</button>
      </div>

      {/* List grouped by category */}
      {cat === "Alle" ? (
        CATS.slice(1).map((catName) => {
          const catItems = items.filter((it) => it.category === catName);
          if (catItems.length === 0) return null;
          return (
            <div key={catName} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{CAT_ICONS[catName]}</span>
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: C.stone }}>{catName}</h3>
                <div className="flex-1 h-px" style={{ background: C.border }} />
              </div>
              <div className="space-y-2">
                {catItems.map((it) => <ItemRow key={it.id} item={it} onToggle={toggle} onRemove={remove} />)}
              </div>
            </div>
          );
        })
      ) : (
        <div className="space-y-2">
          {filtered.map((it) => <ItemRow key={it.id} item={it} onToggle={toggle} onRemove={remove} />)}
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: C.stone }}>Keine Artikel in dieser Kategorie.</p>
            </div>
          )}
        </div>
      )}

      {/* Smart suggestions */}
      <div className="mt-6 bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>💡 Häufig vergessen</h3>
        <div className="flex flex-wrap gap-2">
          {["Zitrone", "Knoblauch", "Salz & Pfeffer", "Essig", "Sesam"].map((s) => (
            <button
              key={s}
              onClick={() => setItems([...items, { id: Date.now(), name: s, amount: "1×", price: 0.99, category: "Vorräte", checked: false }])}
              className="px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ borderColor: C.border, color: C.stone, background: C.white }}
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemRow({ item, onToggle, onRemove }: { item: Item; onToggle: (id: number) => void; onRemove: (id: number) => void }) {
  return (
    <div
      className="flex items-center gap-3 bg-white rounded-xl border p-3 group transition-all"
      style={{ borderColor: C.border, opacity: item.checked ? 0.6 : 1 }}
    >
      <button
        onClick={() => onToggle(item.id)}
        className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
        style={{ borderColor: item.checked ? C.mint : C.border, background: item.checked ? C.mint : "transparent" }}
      >
        {item.checked && <span className="text-white text-[10px] font-bold">✓</span>}
      </button>
      <span className="flex-1 text-sm" style={{ color: C.ink, textDecoration: item.checked ? "line-through" : "none" }}>{item.name}</span>
      <span className="text-xs font-semibold" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.stone }}>{item.amount}</span>
      {item.price > 0 && (
        <span className="text-xs" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>€{item.price.toFixed(2)}</span>
      )}
      <button onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 text-xs p-1 rounded transition-opacity" style={{ color: C.stone }}>✕</button>
    </div>
  );
}
