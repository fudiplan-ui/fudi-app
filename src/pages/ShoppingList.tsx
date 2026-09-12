import { useState } from "react";
import { C } from "../shared/colors";
import BarcodeScannerModal from "../components/BarcodeScannerModal";

type Item = { id: number; name: string; amount: string; price: number; category: string; checked: boolean };

const INITIAL_ITEMS: Item[] = [
  { id:1,  name: "Quinoa",                 amount: "400g",    price: 2.49, category: "Vorräte",        checked: false },
  { id:2,  name: "Avocado Ready-to-Eat",   amount: "3 Stück", price: 2.29, category: "Obst & Gemüse",  checked: true  },
  { id:3,  name: "Kichererbsen (Dose)",    amount: "2x400g",  price: 1.78, category: "Vorräte",        checked: false },
  { id:4,  name: "Bio Babyspinat",         amount: "200g",    price: 1.69, category: "Obst & Gemüse",  checked: false },
  { id:5,  name: "Strauch-Kirschtomaten",  amount: "500g",    price: 1.49, category: "Obst & Gemüse",  checked: false },
  { id:6,  name: "Paprika-Mix (rot/gelb)", amount: "3 Stück", price: 1.89, category: "Obst & Gemüse",  checked: true  },
  { id:7,  name: "Wildlachs-Filet",        amount: "400g",    price: 6.99, category: "Fleisch & Fisch", checked: false },
  { id:8,  name: "Speisequark mager",      amount: "500g",    price: 0.99, category: "Molkerei",       checked: false },
  { id:9,  name: "Zarte Haferflocken",     amount: "500g",    price: 0.79, category: "Vorräte",        checked: false },
  { id:10, name: "Wald-Blaubeeren",        amount: "300g",    price: 2.49, category: "Obst & Gemüse",  checked: false },
  { id:11, name: "Mandeln naturbelassen",  amount: "200g",    price: 2.79, category: "Vorräte",        checked: true  },
  { id:12, name: "Natives Olivenöl Extra", amount: "500ml",   price: 5.49, category: "Vorräte",        checked: false },
  { id:13, name: "Bio Eier (Freiland)",    amount: "10 Stück",price: 2.29, category: "Molkerei",       checked: false },
  { id:14, name: "Feta g.U. Original",     amount: "200g",    price: 2.19, category: "Molkerei",       checked: false },
  { id:15, name: "TK-Erbsen & Brokkoli",   amount: "750g",    price: 1.89, category: "Tiefkühl",      checked: false },
];

const DEALS = [
  { store: "Aldi",     item: "Bio Magerquark 500g",         price: 0.99, oldPrice: 1.35, saving: "-26%", icon: "🥛", category: "Molkerei",       expires: "Sa, 19.09." },
  { store: "Lidl",     item: "Frisches Lachsfilet 400g",    price: 5.49, oldPrice: 7.99, saving: "-31%", icon: "🐟", category: "Fleisch & Fisch", expires: "So, 20.09." },
  { store: "Rewe",     item: "Frische Kulturheidelbeeren 500g", price: 2.29, oldPrice: 3.49, saving: "-34%", icon: "🫐", category: "Obst & Gemüse",  expires: "Fr, 18.09." },
  { store: "Edeka",    item: "Bio Hähnchenbrustfilet 400g", price: 5.99, oldPrice: 7.29, saving: "-18%", icon: "🥩", category: "Fleisch & Fisch", expires: "Sa, 19.09." },
  { store: "Kaufland", item: "Räuchertofu Bio 350g",        price: 1.49, oldPrice: 2.19, saving: "-32%", icon: "🌱", category: "Vorräte",        expires: "Sa, 19.09." },
  { store: "Aldi",     item: "Zarte Bio-Haferflocken 1kg",  price: 1.19, oldPrice: 1.69, saving: "-30%", icon: "🌾", category: "Vorräte",        expires: "Mi, 23.09." },
  { store: "Lidl",     item: "Freilandeier 10er Pack",      price: 2.19, oldPrice: 2.79, saving: "-21%", icon: "🥚", category: "Molkerei",       expires: "So, 20.09." },
  { store: "Rewe",     item: "Griechischer Joghurt 0% 1kg", price: 2.49, oldPrice: 3.29, saving: "-24%", icon: "🥣", category: "Molkerei",       expires: "Fr, 18.09." },
];

const CATS = ["Alle", "Obst & Gemüse", "Fleisch & Fisch", "Molkerei", "Vorräte", "Tiefkühl"];
const CAT_ICONS: Record<string, string> = {
  "Obst & Gemüse": "🥗",
  "Fleisch & Fisch": "🥩",
  "Molkerei": "🥛",
  "Vorräte": "🌾",
  "Tiefkühl": "❄️",
};

export default function ShoppingList() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cat, setCat] = useState("Alle");
  const [newName, setNewName] = useState("");
  const [newAmt, setNewAmt] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [showDeals, setShowDeals] = useState(true);

  const toggle = (id: number) => setItems(items.map((it) => it.id === id ? { ...it, checked: !it.checked } : it));
  const remove = (id: number) => setItems(items.filter((it) => it.id !== id));

  const addItem = () => {
    if (!newName.trim()) return;
    setItems([...items, {
      id: Date.now(),
      name: newName.trim(),
      amount: newAmt || "1x",
      price: parseFloat(newPrice) || 0,
      category: cat === "Alle" ? "Vorräte" : cat,
      checked: false,
    }]);
    setNewName("");
    setNewAmt("");
    setNewPrice("");
  };

  const addDealToList = (deal: typeof DEALS[0]) => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        name: `${deal.item} (${deal.store})`,
        amount: "1 Pck.",
        price: deal.price,
        category: deal.category,
        checked: false
      }
    ]);
  };

  const filtered = cat === "Alle" ? items : items.filter((it) => it.category === cat);
  const total = items.filter((it) => !it.checked).reduce((s, it) => s + it.price, 0);
  const done = items.filter((it) => it.checked).length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BarcodeScannerModal isOpen={barcodeOpen} onClose={() => setBarcodeOpen(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Smarte Einkaufsliste & Angebote 🛒
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.stone }}>
            {done} von {items.length} Artikeln im Korb • Geschätzter Einkaufswert: {total.toFixed(2)} €
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setBarcodeOpen(true)}
            className="text-xs px-3.5 py-2 rounded-xl font-bold border flex items-center gap-1.5 transition-all hover:bg-emerald-50"
            style={{ borderColor: C.border, color: C.forest }}
          >
            📷 Barcode scannen
          </button>
          <button
            onClick={() => setShowDeals(!showDeals)}
            className="text-xs px-3.5 py-2 rounded-xl text-white font-bold transition-all shadow-sm"
            style={{ background: showDeals ? C.mint : C.forest }}
          >
            {showDeals ? "🏷️ Deals ausblenden" : "🏷️ Supermarkt-Deals anzeigen"}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border p-4 mb-6 shadow-sm" style={{ borderColor: C.border }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: C.stone }}>Einkaufsfortschritt</span>
          <span className="font-bold font-mono" style={{ color: C.forest }}>{pct}% ({done}/{items.length})</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{ width: `${pct}%`, background: pct === 100 ? C.mint : C.coral }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Item List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Add Form */}
          <div className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: C.border }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">+ Artikel manuell hinzufügen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Artikelname (z.B. Bio-Eier)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-xs p-2.5 rounded-xl border bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 sm:col-span-2"
                style={{ borderColor: C.border }}
              />
              <input
                type="text"
                placeholder="Menge (z.B. 500g)"
                value={newAmt}
                onChange={(e) => setNewAmt(e.target.value)}
                className="text-xs p-2.5 rounded-xl border bg-gray-50 focus:outline-none focus:bg-white"
                style={{ borderColor: C.border }}
              />
            </div>
            <div className="flex justify-between items-center pt-1">
              <input
                type="number"
                step="0.01"
                placeholder="Preis (€, opt.)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="text-xs p-2 rounded-xl border bg-gray-50 w-28 focus:outline-none"
                style={{ borderColor: C.border }}
              />
              <button
                onClick={addItem}
                className="text-xs px-4 py-2 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: C.forest }}
              >
                Hinzufügen
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border"
                style={{
                  background: cat === c ? C.forest : "white",
                  color: cat === c ? "white" : C.stone,
                  borderColor: cat === c ? C.forest : C.border,
                }}
              >
                {CAT_ICONS[c] ? `${CAT_ICONS[c]} ` : ""}{c}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white rounded-xl border p-3 group transition-all hover:border-gray-300"
                style={{ borderColor: C.border, opacity: item.checked ? 0.6 : 1 }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor: item.checked ? C.mint : C.border,
                    background: item.checked ? C.mint : "transparent"
                  }}
                >
                  {item.checked && <span className="text-white text-[11px] font-black">✓</span>}
                </button>
                <span className="flex-1 text-xs sm:text-sm font-medium" style={{ color: C.ink, textDecoration: item.checked ? "line-through" : "none" }}>
                  {item.name}
                </span>
                <span className="text-xs font-semibold font-mono" style={{ color: C.stone }}>
                  {item.amount}
                </span>
                {item.price > 0 && (
                  <span className="text-xs font-bold font-mono" style={{ color: C.mint }}>
                    {item.price.toFixed(2)} €
                  </span>
                )}
                <button
                  onClick={() => remove(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-xs p-1 text-gray-400 hover:text-red-500 rounded transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Verified Supermarket Deals */}
        {showDeals && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: C.forest }}>
                  <span>🏷️</span> Aktuelle Angebote der Woche
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                  Live Sparen
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-3">
                Preisvergleich aus Prospekten (KW 37/38) für proteinreiche & gesunde Lebensmittel:
              </p>

              <div className="space-y-2.5">
                {DEALS.map((d, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg p-1 rounded-lg bg-white shadow-xs">{d.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded text-white bg-slate-700">{d.store}</span>
                          <span className="text-xs font-bold text-gray-800 leading-tight">{d.item}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span className="text-red-600 font-bold">{d.saving}</span>
                          <span className="line-through">{d.oldPrice.toFixed(2)} €</span>
                          <span>• Bis {d.expires}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-black font-mono text-emerald-600">{d.price.toFixed(2)} €</span>
                      <button
                        onClick={() => addDealToList(d)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                      >
                        + Auf Liste
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <h4 className="text-xs font-bold text-amber-900 mb-1">💡 Smart Shopping Tipp</h4>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Tiefkühl-Gemüse und Beeren besitzen durch Schockfrostung oft mehr Vitamine als tagelang gelagerte Frischware – und kosten im Schnitt 30-40% weniger.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}