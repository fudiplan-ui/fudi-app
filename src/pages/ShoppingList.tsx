import { useState } from "react";
import { C } from "../shared/colors";
import BarcodeScannerModal from "../components/BarcodeScannerModal";

type Item = { id: number; name: string; amount: string; price: number; category: string; checked: boolean };

const INITIAL_ITEMS: Item[] = [
  { id:1,  name: "Quinoa",           amount: "400g",    price: 2.99, category: "Vorraete",       checked: false },
  { id:2,  name: "Avocado",          amount: "3 Stueck", price: 2.49, category: "Obst & Gemuese", checked: true  },
  { id:3,  name: "Kichererbsen",     amount: "2x400g",  price: 1.98, category: "Vorraete",       checked: false },
  { id:4,  name: "Babyspinat",       amount: "200g",    price: 1.79, category: "Obst & Gemuese", checked: false },
  { id:5,  name: "Kirschtomaten",    amount: "500g",    price: 1.49, category: "Obst & Gemuese", checked: false },
  { id:6,  name: "Rote Paprika",     amount: "3 Stueck", price: 1.97, category: "Obst & Gemuese", checked: true  },
  { id:7,  name: "Lachs (Filet)",    amount: "600g",    price: 8.99, category: "Fleisch & Fisch", checked: false },
  { id:8,  name: "Griechischer Joghurt", amount: "500g", price: 1.99, category: "Molkerei",      checked: false },
  { id:9,  name: "Haferflocken",     amount: "500g",    price: 1.29, category: "Vorraete",       checked: false },
  { id:10, name: "Blaubeeren",       amount: "250g",    price: 2.49, category: "Obst & Gemuese", checked: false },
  { id:11, name: "Mandeln",          amount: "200g",    price: 2.99, category: "Vorraete",       checked: true  },
  { id:12, name: "Olivenoel",        amount: "500ml",   price: 4.49, category: "Vorraete",       checked: false },
  { id:13, name: "Tahini",           amount: "250g",    price: 3.49, category: "Vorraete",       checked: false },
  { id:14, name: "Feta",             amount: "200g",    price: 2.29, category: "Molkerei",       checked: false },
  { id:15, name: "Tiefkuehl-Erbsen", amount: "600g",    price: 1.79, category: "Tiefkuehl",     checked: false },
];

const DEALS = [
  { store: "Aldi", item: "Bio Haferflocken 1kg", price: "1.19", saving: "-30%", icon: "🌾", expires: "Sa, 07.09." },
  { store: "Lidl",  item: "Lachsfilet 400g",    price: "4.99", saving: "-40%", icon: "🐟", expires: "So, 08.09." },
  { store: "Rewe",  item: "Blaubeeren 500g",    price: "1.79", saving: "-20%", icon: "🫐", expires: "Fr, 06.09." },
  { store: "Edeka", item: "Quinoa 500g",         price: "2.29", saving: "-25%", icon: "🌾", expires: "Sa, 07.09." },
];

const CATS = ["Alle", "Obst & Gemuese", "Fleisch & Fisch", "Molkerei", "Vorraete", "Tiefkuehl"];
const CATS_DISPLAY: Record<string, string> = {
  "Alle": "Alle",
  "Obst & Gemuese": "Obst & Gemuese",
  "Fleisch & Fisch": "Fleisch & Fisch",
  "Molkerei": "Molkerei",
  "Vorraete": "Vorraete",
  "Tiefkuehl": "Tiefkuehl",
};
const CAT_ICONS: Record<string, string> = {
  "Obst & Gemuese": "🥦",
  "Fleisch & Fisch": "🐟",
  "Molkerei": "🧀",
  "Vorraete": "🫙",
  "Tiefkuehl": "❄️",
};

function ItemRow({ item, onToggle, onRemove }: { item: Item; onToggle: (id: number) => void; onRemove: (id: number) => void }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border p-3 group transition-all"
      style={{ borderColor: C.border, opacity: item.checked ? 0.6 : 1 }}>
      <button onClick={() => onToggle(item.id)}
        className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
        style={{ borderColor: item.checked ? C.mint : C.border, background: item.checked ? C.mint : "transparent" }}>
        {item.checked && <span className="text-white text-[10px] font-bold">✓</span>}
      </button>
      <span className="flex-1 text-sm" style={{ color: C.ink, textDecoration: item.checked ? "line-through" : "none" }}>{item.name}</span>
      <span className="text-xs font-semibold" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.stone }}>{item.amount}</span>
      {item.price > 0 && <span className="text-xs" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>€{item.price.toFixed(2)}</span>}
      <button onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 text-xs p-1 rounded transition-opacity" style={{ color: C.stone }}>x</button>
    </div>
  );
}

export default function ShoppingList() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cat, setCat] = useState("Alle");
  const [newName, setNewName] = useState("");
  const [newAmt, setNewAmt] = useState("");
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [showDeals, setShowDeals] = useState(true);

  const toggle = (id: number) => setItems(items.map((it) => it.id === id ? { ...it, checked: !it.checked } : it));
  const remove = (id: number) => setItems(items.filter((it) => it.id !== id));
  const addItem = () => {
    if (!newName.trim()) return;
    setItems([...items, {
      id: Date.now(), name: newName.trim(), amount: newAmt || "1x",
      price: 0, category: cat === "Alle" ? "Vorraete" : cat, checked: false,
    }]);
    setNewName(""); setNewAmt("");
  };

  const filtered = cat === "Alle" ? items : items.filter((it) => it.category === cat);
  const total = items.filter((it) => !it.checked).reduce((s, it) => s + it.price, 0);
  const done = items.filter((it) => it.checked).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <BarcodeScannerModal isOpen={barcodeOpen} onClose={() => setBarcodeOpen(false)} />

      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Einkaufsliste 🛒
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.stone }}>{done} von {items.length} eingekauft</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setBarcodeOpen(true)}
            className="text-xs px-3 py-2 rounded-xl font-semibold border flex items-center gap-1.5 transition-all hover:border-green-400 hover:bg-green-50"
            style={{ borderColor: C.border, color: C.forest }}>
            📊 Barcode
          </button>
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
            <p className="text-xs" style={{ color: C.stone }}>Geschaetzte Kosten</p>
            <p className="font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>€{total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Supermarkt Deals Banner */}
      <div className="bg-white rounded-2xl border mb-4 overflow-hidden" style={{ borderColor: C.border }}>
        <button onClick={() => setShowDeals(!showDeals)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏪</span>
            <div className="text-left">
              <p className="text-sm font-bold" style={{ color: C.forest }}>Aktuelle Supermarkt-Angebote</p>
              <p className="text-xs" style={{ color: C.stone }}>Diese Woche im Angebot - passend zu deiner Liste</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: C.coral }}>4 Deals</span>
            <span className="text-xs" style={{ color: C.stone }}>{showDeals ? "▲" : "▼"}</span>
          </div>
        </button>
        {showDeals && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            {DEALS.map((deal, i) => (
              <div key={i} className="p-3 rounded-xl border" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{deal.icon}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#16a34a" }}>{deal.saving}</span>
                </div>
                <p className="text-xs font-bold leading-tight" style={{ color: C.forest }}>{deal.item}</p>
                <p className="text-[10px] mt-0.5" style={{ color: C.stone }}>{deal.store} · bis {deal.expires}</p>
                <p className="text-sm font-black mt-1" style={{ fontFamily: "'JetBrains Mono',monospace", color: "#16a34a" }}>€{deal.price}</p>
              </div>
            ))}
            <div className="col-span-2">
              <input placeholder="Postleitzahl eingeben fur lokale Angebote (z.B. 80331)"
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{ borderColor: C.border, background: "#f9fafb" }} />
            </div>
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ background: cat === c ? C.forest : C.white, color: cat === c ? C.white : C.stone, border: `1.5px solid ${cat === c ? C.forest : C.border}` }}>
            {CAT_ICONS[c] || "📋"} {CATS_DISPLAY[c]}
          </button>
        ))}
      </div>

      {/* Add item */}
      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="Artikel hinzufuegen..."
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm border outline-none"
          style={{ borderColor: C.border, background: C.white }} />
        <input value={newAmt} onChange={(e) => setNewAmt(e.target.value)}
          placeholder="Menge"
          className="w-20 px-3 py-2.5 rounded-xl text-sm border outline-none"
          style={{ borderColor: C.border, background: C.white }} />
        <button onClick={addItem} className="px-3 py-2.5 rounded-xl text-white font-bold text-sm" style={{ background: C.mint }}>+</button>
      </div>

      {/* List */}
      {cat === "Alle" ? (
        CATS.slice(1).map((catName) => {
          const catItems = items.filter((it) => it.category === catName);
          if (catItems.length === 0) return null;
          return (
            <div key={catName} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{CAT_ICONS[catName]}</span>
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: C.stone }}>{CATS_DISPLAY[catName]}</h3>
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
        <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>💡 Haeufig vergessen</h3>
        <div className="flex flex-wrap gap-2">
          {["Zitrone", "Knoblauch", "Salz & Pfeffer", "Essig", "Sesam", "Tomaten (Dose)", "Linsen"].map((s) => (
            <button key={s}
              onClick={() => setItems([...items, { id: Date.now(), name: s, amount: "1x", price: 0.99, category: "Vorraete", checked: false }])}
              className="px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:bg-green-50 hover:border-green-400"
              style={{ borderColor: C.border, color: C.stone, background: C.white }}>
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Barcode CTA */}
      <div className="mt-4 p-4 rounded-2xl border flex items-center justify-between gap-3"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", borderColor: "#bbf7d0" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-sm font-bold" style={{ color: C.forest }}>Barcode scannen</p>
            <p className="text-xs" style={{ color: C.stone }}>NutriScore, Nova-Gruppe & Blutzucker-Wirkung sofort pruefen</p>
          </div>
        </div>
        <button onClick={() => setBarcodeOpen(true)}
          className="shrink-0 px-4 py-2 rounded-xl font-bold text-xs text-white"
          style={{ background: C.forest }}>
          Scanner öffnen
        </button>
      </div>
    </div>
  );
}
