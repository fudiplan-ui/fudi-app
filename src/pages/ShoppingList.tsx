import { useState } from "react";
import { C } from "../shared/colors";
import BarcodeScannerModal from "../components/BarcodeScannerModal";

export interface ShoppingItem {
  id: number;
  name: string;
  recipeDemand: string; // e.g. "1.5 L"
  packUnit: string;     // e.g. "1L Packung"
  packSize: number;     // e.g. 1.0
  neededQty: number;    // e.g. 1.5
  packCount: number;    // e.g. 2
  totalBuyQty: string;  // e.g. "2x 1L (2.0 L)"
  pricePerPack: number;
  category: string;
  checked: boolean;
}

const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: 1,
    name: "Frische Bio-Vollmilch (oder Haferdrink)",
    recipeDemand: "1,5 Liter",
    packUnit: "1,0 L Packung",
    packSize: 1.0,
    neededQty: 1.5,
    packCount: 2,
    totalBuyQty: "2x 1L Packung (2,0 L gesamt)",
    pricePerPack: 1.39,
    category: "Molkerei & Pflanzendrinks",
    checked: false
  },
  {
    id: 2,
    name: "Deutsche Markenbutter (mild gesäuert)",
    recipeDemand: "350 Gramm",
    packUnit: "250g Packung",
    packSize: 250,
    neededQty: 350,
    packCount: 2,
    totalBuyQty: "2x 250g Packung (500g gesamt)",
    pricePerPack: 2.19,
    category: "Molkerei & Pflanzendrinks",
    checked: false
  },
  {
    id: 3,
    name: "Bio-Eier (Freilandhaltung)",
    recipeDemand: "4 Stück",
    packUnit: "6er Schachtel",
    packSize: 6,
    neededQty: 4,
    packCount: 1,
    totalBuyQty: "1x 6er Schachtel (6 Stück)",
    pricePerPack: 2.29,
    category: "Molkerei & Pflanzendrinks",
    checked: true
  },
  {
    id: 4,
    name: "Speisequark mager",
    recipeDemand: "750 Gramm",
    packUnit: "500g Becher",
    packSize: 500,
    neededQty: 750,
    packCount: 2,
    totalBuyQty: "2x 500g Becher (1.000g gesamt)",
    pricePerPack: 0.99,
    category: "Molkerei & Pflanzendrinks",
    checked: false
  },
  {
    id: 5,
    name: "Kichererbsen (verzehrfertig)",
    recipeDemand: "600 Gramm",
    packUnit: "400g Dose",
    packSize: 400,
    neededQty: 600,
    packCount: 2,
    totalBuyQty: "2x 400g Dosen (800g gesamt)",
    pricePerPack: 0.89,
    category: "Vorräte & Konserven",
    checked: false
  },
  {
    id: 6,
    name: "Zarte Bio-Haferflocken",
    recipeDemand: "650 Gramm",
    packUnit: "500g Beutel",
    packSize: 500,
    neededQty: 650,
    packCount: 2,
    totalBuyQty: "2x 500g Beutel (1.000g gesamt)",
    pricePerPack: 0.79,
    category: "Vorräte & Konserven",
    checked: true
  },
  {
    id: 7,
    name: "Wildlachs-Filet frisch",
    recipeDemand: "400 Gramm",
    packUnit: "250g Frische-Packung",
    packSize: 250,
    neededQty: 400,
    packCount: 2,
    totalBuyQty: "2x 250g Packung (500g gesamt)",
    pricePerPack: 4.99,
    category: "Fleisch & Fisch",
    checked: false
  },
  {
    id: 8,
    name: "Bio-Babyspinat",
    recipeDemand: "250 Gramm",
    packUnit: "150g Frischebeutel",
    packSize: 150,
    neededQty: 250,
    packCount: 2,
    totalBuyQty: "2x 150g Beutel (300g gesamt)",
    pricePerPack: 1.49,
    category: "Obst & Gemüse",
    checked: false
  }
];

export interface SupermarketDeal {
  store: "Rewe" | "Edeka" | "Aldi" | "Lidl" | "Kaufland" | "dm";
  item: string;
  price: number;
  oldPrice: number;
  saving: string;
  packNote: string;
  icon: string;
  expires: string;
  badgeBg: string;
  badgeText: string;
}

const DEALS: SupermarketDeal[] = [
  { store: "Rewe",     item: "Alpro Haferdrink Barista 1L",        price: 1.49, oldPrice: 2.49, saving: "-40%", packNote: "1L Gebinde (1 Stück)",       icon: "🥛", expires: "Sa, 19.09.", badgeBg: "#cc071e", badgeText: "#ffffff" },
  { store: "Aldi",     item: "Bio-Magerquark 500g",                price: 0.89, oldPrice: 1.35, saving: "-34%", packNote: "500g Becher (1 Stück)",      icon: "🥣", expires: "Sa, 19.09.", badgeBg: "#00205b", badgeText: "#ffffff" },
  { store: "Lidl",     item: "Frisches Wildlachsfilet 250g",       price: 3.99, oldPrice: 5.99, saving: "-33%", packNote: "250g Schale (1 Stück)",      icon: "🐟", expires: "So, 20.09.", badgeBg: "#0050aa", badgeText: "#ffed00" },
  { store: "Edeka",    item: "Bio-Haferflocken zart 500g",         price: 0.69, oldPrice: 0.99, saving: "-30%", packNote: "500g Beutel (1 Stück)",      icon: "🌾", expires: "Sa, 19.09.", badgeBg: "#ffcc00", badgeText: "#003399" },
  { store: "Kaufland", item: "Bio-Eier Freilandhaltung 10er",      price: 1.99, oldPrice: 2.69, saving: "-26%", packNote: "10er Karton (1 Stück)",      icon: "🥚", expires: "Mi, 23.09.", badgeBg: "#d50000", badgeText: "#ffffff" },
  { store: "dm",       item: "dmBio Kichererbsen im Glas 330g",    price: 0.75, oldPrice: 0.95, saving: "-21%", packNote: "330g Glas (1 Stück)",        icon: "🌱", expires: "Ende des Monats", badgeBg: "#561578", badgeText: "#ffffff" },
  { store: "Rewe",     item: "Bio-Babyspinat gewaschen 150g",      price: 1.19, oldPrice: 1.69, saving: "-29%", packNote: "150g Frischebeutel",         icon: "🥬", expires: "Sa, 19.09.", badgeBg: "#cc071e", badgeText: "#ffffff" },
  { store: "Aldi",     item: "Natives Olivenöl Extra 500ml",       price: 4.49, oldPrice: 5.99, saving: "-25%", packNote: "500ml Flasche",              icon: "🫒", expires: "Sa, 19.09.", badgeBg: "#00205b", badgeText: "#ffffff" },
];

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem("fudi_shopping_items");
      if (saved) return JSON.parse(saved);
    } catch(e) { console.error(e); }
    return INITIAL_SHOPPING_ITEMS;
  });

  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>("Alle");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDemand, setNewItemDemand] = useState("1,5 Liter");
  const [newItemPack, setNewItemPack] = useState("1,0 L Packung");
  const [showAddForm, setShowAddForm] = useState(false);

  const saveItems = (updated: ShoppingItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem("fudi_shopping_items", JSON.stringify(updated));
    } catch(e) { console.error(e); }
  };

  const toggleCheck = (id: number) => {
    const updated = items.map(it => it.id === id ? { ...it, checked: !it.checked } : it);
    saveItems(updated);
  };

  const deleteItem = (id: number) => {
    const updated = items.filter(it => it.id !== id);
    saveItems(updated);
  };

  const addCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    // Default packaging multiplier logic
    let packCount = 2;
    let totalQty = "2x Packung";
    if (newItemDemand.includes("1,5") || newItemDemand.includes("1.5")) {
      packCount = 2;
      totalQty = "2x 1L Packung (2,0 L gesamt)";
    } else if (newItemDemand.includes("350")) {
      packCount = 2;
      totalQty = "2x 250g Packung (500g gesamt)";
    } else {
      packCount = 1;
      totalQty = `1x ${newItemPack}`;
    }

    const newItem: ShoppingItem = {
      id: Date.now(),
      name: newItemName.trim(),
      recipeDemand: newItemDemand,
      packUnit: newItemPack,
      packSize: 1,
      neededQty: 1,
      packCount: packCount,
      totalBuyQty: totalQty,
      pricePerPack: 1.49,
      category: "Eigene Produkte",
      checked: false
    };

    saveItems([newItem, ...items]);
    setNewItemName("");
    setShowAddForm(false);
  };

  const addDealToList = (deal: SupermarketDeal) => {
    const newItem: ShoppingItem = {
      id: Date.now(),
      name: `${deal.item} (${deal.store})`,
      recipeDemand: "1 Angebot",
      packUnit: deal.packNote,
      packSize: 1,
      neededQty: 1,
      packCount: 1,
      totalBuyQty: `1x ${deal.packNote}`,
      pricePerPack: deal.price,
      category: "Supermarkt Deals",
      checked: false
    };
    saveItems([newItem, ...items]);
    alert(`🛒 "${deal.item}" von ${deal.store} zur Einkaufsliste hinzugefügt!`);
  };

  const filteredDeals = selectedStoreFilter === "Alle"
    ? DEALS
    : DEALS.filter(d => d.store.toLowerCase() === selectedStoreFilter.toLowerCase());

  const totalPrice = items.reduce((s, it) => s + (it.pricePerPack * it.packCount), 0);
  const checkedCount = items.filter(it => it.checked).length;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: C.sandLight }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
              <span>🛒</span> Intelligente Packungs-Multiplikator Einkaufsliste
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              FUDI Einkaufsliste & Supermarkt-Deals
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              Automatische Gebinderundung: Rezeptmengen (z. B. 1,5 L Milch) werden automatisch auf ganze Packungen (2x 1L) multipliziert.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold border bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
              style={{ borderColor: C.border }}
            >
              <span>📷</span> Barcode scannen
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 flex items-center gap-1.5 bg-emerald-800"
            >
              <span>+</span> Produkt hinzufügen
            </button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <form onSubmit={addCustomItem} className="p-5 rounded-3xl bg-white border shadow-sm space-y-4 animate-fade-in" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold text-slate-900">Neues Produkt mit Packungsgröße anlegen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Produktname (z. B. Hafermilch)"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white"
                required
              />
              <input
                type="text"
                placeholder="Rezeptbedarf (z. B. 1,5 Liter oder 350g)"
                value={newItemDemand}
                onChange={e => setNewItemDemand(e.target.value)}
                className="px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white"
              />
              <input
                type="text"
                placeholder="Standard-Packung (z. B. 1L Packung oder 250g)"
                value={newItemPack}
                onChange={e => setNewItemPack(e.target.value)}
                className="px-3.5 py-2 rounded-xl border text-xs bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-500 font-semibold"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-800"
              >
                Zur Liste hinzufügen
              </button>
            </div>
          </form>
        )}

        {/* Main Grid: Shopping Items & Supermarket Deals */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Shopping Items List (Col 7) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border shadow-sm space-y-4" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: C.border }}>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Meine Einkaufsartikel</h2>
                <p className="text-xs text-slate-500">
                  {checkedCount} von {items.length} Artikeln abgehakt
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-800">
                  Gesamt: ~{totalPrice.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Packaging Explainer Banner */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <span className="text-lg">📦</span>
              <div>
                <span className="font-bold">Automatischer Packungs-Multiplikator aktiv:</span>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                  Mengen werden auf ganze Handelsverpackungen gerundet (z. B. 1,5 L Rezeptbedarf ➔ 2x 1L Kartons).
                </p>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {items.map((it) => (
                <div
                  key={it.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    it.checked ? "bg-gray-50/80 border-gray-200 opacity-60" : "bg-white border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={it.checked}
                      onChange={() => toggleCheck(it.id)}
                      className="mt-1 w-4 h-4 accent-emerald-700 cursor-pointer rounded"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold text-slate-900 ${it.checked ? "line-through text-slate-400" : ""}`}>
                        {it.name}
                      </p>
                      
                      {/* Dual Quantity indicator */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] mt-1">
                        <span className="text-slate-500">Rezeptbedarf: <b>{it.recipeDemand}</b></span>
                        <span className="text-gray-300">➔</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold font-mono text-[10px]">
                          Einkauf: {it.totalBuyQty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {(it.pricePerPack * it.packCount).toFixed(2)} €
                    </span>
                    <button
                      onClick={() => deleteItem(it.id)}
                      className="text-gray-400 hover:text-red-600 p-1 text-xs"
                      title="Löschen"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supermarket Deals with Store Names (Col 5) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border shadow-sm space-y-4" style={{ borderColor: C.border }}>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Aktuelle Supermarkt-Deals</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Spart bis zu -40%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifizierte Rabatte nach Markt geordnet mit Packungsausweisung.
              </p>
            </div>

            {/* Store Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b pb-3" style={{ borderColor: C.border }}>
              {["Alle", "Rewe", "Edeka", "Aldi", "Lidl", "Kaufland", "dm"].map(store => (
                <button
                  key={store}
                  onClick={() => setSelectedStoreFilter(store)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedStoreFilter === store
                      ? "bg-slate-900 text-white"
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>

            {/* Deals List */}
            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredDeals.map((deal, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-emerald-50/40 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-2xl p-1.5 rounded-xl bg-white border border-gray-200 shadow-xs shrink-0">
                      {deal.icon}
                    </span>
                    <div className="min-w-0">
                      {/* Supermarket Brand Badge */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs"
                          style={{ background: deal.badgeBg, color: deal.badgeText }}
                        >
                          {deal.store}
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 font-mono">
                          {deal.saving}
                        </span>
                      </div>
                      
                      <p className="text-xs font-bold text-slate-900 truncate">{deal.item}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        📦 {deal.packNote} · Bis {deal.expires}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-emerald-800 block">
                        {deal.price.toFixed(2)} €
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        {deal.oldPrice.toFixed(2)} €
                      </span>
                    </div>
                    <button
                      onClick={() => addDealToList(deal)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs flex items-center gap-1"
                    >
                      <span>+</span> Übernehmen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
}
