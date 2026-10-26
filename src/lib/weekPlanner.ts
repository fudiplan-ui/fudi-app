/**
 * FUDI Wochenplaner – No-Waste, Diät- & Preisbewusste Mahlzeitenplanung.
 *
 * RECHTSSICHERHEIT:
 * - Keine medizinischen oder ernährungswissenschaftlichen Heilversprechen.
 * - Preise sind Platzhalter und müssen manuell gepflegt werden (keine Shop-API).
 * - Keine Integration mit Picnic/Rewe/Edeka ohne offizielle API.
 */

import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";

export type Diet = "Vegan" | "Vegetarisch" | "Keto" | "Paleo" | "LowCarb" | "Mixed";
export type Priority = "guenstig" | "schnell" | "saison" | "proteinreich" | "lowGI";
export type ShopType = "lokal" | "online";

export interface UserPreferences {
  diet: Diet;
  allergies: string[];
  budgetPerWeek: number;
  priorities: Priority[];
  noWaste: boolean;
  householdSize: number;
  plz?: string;
}

export interface Shop {
  id: string;
  name: string;
  type: ShopType;
  plz?: string;
  delivery: boolean;
  discountActive: boolean;
}

export interface PriceEntry {
  ingredient: string;
  unitPrice: number;
  unit: string;
  shopId: string;
  validFrom: string;
  validTo?: string;
  discountPct?: number;
}

export interface ShoppingListItem {
  ingredient: string;
  amount: number;
  unit: string;
  estimatedCost: number;
  shopId: string;
  shopName: string;
  discountPct?: number;
}

export interface WeekPlan {
  weekStart: string;
  recipes: RecipeItem[];
  shoppingList: ShoppingListItem[];
  totalCost: number;
  noWasteTips: string[];
  generatedAt: string;
}

const DEFAULT_SHOPS: Shop[] = [
  { id: "rewe", name: "REWE", type: "lokal", delivery: true, discountActive: true },
  { id: "edeka", name: "EDEKA", type: "lokal", delivery: true, discountActive: true },
  { id: "picnic", name: "Picnic", type: "online", delivery: true, discountActive: false },
  { id: "alnatura", name: "Alnatura", type: "lokal", delivery: false, discountActive: false },
  { id: "markt", name: "Lokaler Wochenmarkt", type: "lokal", delivery: false, discountActive: false },
];

export const PRICE_INDEX: PriceEntry[] = [
  { ingredient: "Hähnchenbrust", unitPrice: 8.99, unit: "kg", shopId: "rewe", validFrom: "2026-01-01", discountPct: 20 },
  { ingredient: "Tofu", unitPrice: 2.49, unit: "Stück", shopId: "edeka", validFrom: "2026-01-01" },
  { ingredient: "Brot", unitPrice: 1.99, unit: "Stück", shopId: "rewe", validFrom: "2026-01-01" },
  { ingredient: "Milch", unitPrice: 0.99, unit: "Liter", shopId: "picnic", validFrom: "2026-01-01" },
  { ingredient: "Hafermilch", unitPrice: 1.79, unit: "Liter", shopId: "alnatura", validFrom: "2026-01-01" },
  { ingredient: "Eier", unitPrice: 2.19, unit: "Stück", shopId: "markt", validFrom: "2026-01-01" },
  { ingredient: "Tomate", unitPrice: 2.49, unit: "kg", shopId: "rewe", validFrom: "2026-01-01", discountPct: 10 },
  { ingredient: "Spinat", unitPrice: 1.49, unit: "Beutel", shopId: "edeka", validFrom: "2026-01-01" },
];

export function getShopById(id: string): Shop | undefined {
  return DEFAULT_SHOPS.find((s) => s.id === id);
}

export function getPriceForIngredient(ingredient: string, shopId?: string): PriceEntry | undefined {
  const q = ingredient.toLowerCase();
  const matches = PRICE_INDEX.filter((p) => p.ingredient.toLowerCase().includes(q));
  if (matches.length === 0) return undefined;
  if (shopId) {
    const shopMatch = matches.find((p) => p.shopId === shopId);
    if (shopMatch) return shopMatch;
  }
  return matches.reduce((best, cur) => (cur.unitPrice < best.unitPrice ? cur : best));
}

function matchesPreferences(recipe: RecipeItem, prefs: UserPreferences): boolean {
  if (prefs.diet !== "Mixed" && recipe.diet !== prefs.diet) return false;
  const recipeAllergenText = [
    ...recipe.allergies,
    ...recipe.ingredients.map((i) => i.name),
    recipe.title,
  ].join(" ").toLowerCase();
  for (const a of prefs.allergies) {
    if (recipeAllergenText.includes(a.toLowerCase())) return false;
  }
  return true;
}

function scoreRecipe(recipe: RecipeItem, prefs: UserPreferences): number {
  let score = 0;
  if (prefs.priorities.includes("schnell") && recipe.time <= 30) score += 2;
  if (prefs.priorities.includes("guenstig") && recipe.rating >= 4.0) score += 1;
  if (prefs.priorities.includes("proteinreich") && recipe.protein >= 20) score += 2;
  if (prefs.priorities.includes("lowGI") && recipe.gi === "low") score += 2;
  if (prefs.priorities.includes("saison")) score += 1;
  return score;
}

function aggregateIngredients(
  recipes: RecipeItem[],
  factor: number
): { ingredient: string; amount: number; unit: string }[] {
  const map = new Map<string, { amount: number; unit: string }>();

  for (const recipe of recipes) {
    const f = factor / recipe.portions;
    for (const ing of recipe.ingredients) {
      const numMatch = ing.amount.match(/([\d.,]+)\s*(.*)/);
      if (!numMatch) continue;
      const amount = parseFloat(numMatch[1].replace(",", ".")) * f;
      const unit = numMatch[2].trim();

      const key = ing.name.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.amount += amount;
      } else {
        map.set(key, { amount, unit });
      }
    }
  }

  return Array.from(map.entries()).map(([ingredient, v]) => ({
    ingredient,
    amount: Math.round(v.amount * 10) / 10,
    unit: v.unit,
  }));
}

export function generateWeekPlan(
  prefs: UserPreferences,
  weekStart: string = new Date().toISOString().split("T")[0]
): WeekPlan {
  const candidates = RECIPES_DB.filter((r) => matchesPreferences(r, prefs));

  const scored = candidates
    .map((r) => ({ recipe: r, score: scoreRecipe(r, prefs) }))
    .sort((a, b) => b.score - a.score);

  const selected: RecipeItem[] = [];
  const usedTags = new Set<string>();

  for (const { recipe } of scored) {
    if (selected.length >= 3) break;
    if (prefs.noWaste && usedTags.has(recipe.tag) && selected.length > 0) continue;
    selected.push(recipe);
    usedTags.add(recipe.tag);
  }

  if (selected.length < 3) {
    for (const { recipe } of scored) {
      if (selected.length >= 3) break;
      if (!selected.includes(recipe)) selected.push(recipe);
    }
  }

  const totalPortions = selected.reduce((sum, r) => sum + r.portions, 0);
  const factor = (prefs.householdSize * 7) / Math.max(totalPortions, 1);
  const rawIngredients = aggregateIngredients(selected, factor);

  const shoppingList: ShoppingListItem[] = [];
  let totalCost = 0;

  for (const item of rawIngredients) {
    const price = getPriceForIngredient(item.ingredient);
    const shop = price ? getShopById(price.shopId) : undefined;
    const cost = price ? (item.amount / 1000) * price.unitPrice : 0;

    shoppingList.push({
      ingredient: item.ingredient,
      amount: item.amount,
      unit: item.unit,
      estimatedCost: Math.round(cost * 100) / 100,
      shopId: price?.shopId ?? "unbekannt",
      shopName: shop?.name ?? "Unbekannt",
      discountPct: price?.discountPct,
    });
    totalCost += cost;
  }

  const noWasteTips: string[] = [];
  if (prefs.noWaste && selected.length > 1) {
    const allNames = selected.flatMap((r) =>
      r.ingredients.map((i) => i.name.toLowerCase())
    );
    const duplicates = allNames.filter(
      (name, idx) => allNames.indexOf(name) !== idx
    );
    if (duplicates.length > 0) {
      noWasteTips.push(
        `Folgende Zutaten kommen mehrfach vor und können gemeinsam gekauft werden: ${[...new Set(duplicates)].join(", ")}.`
      );
    }
    noWasteTips.push("Übrig gebliebene Gemüse-Reste eignen sich für Suppen oder Pfannen-Gerichte am Wochenende.");
  }

  return {
    weekStart,
    recipes: selected,
    shoppingList,
    totalCost: Math.round(totalCost * 100) / 100,
    noWasteTips,
    generatedAt: new Date().toISOString(),
  };
}

export function formatPrice(eur: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(eur);
}