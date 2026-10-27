/**
 * FUDI Wochenplaner – No-Waste, Diät- & Preisbewusste Mahlzeitenplanung.
 * Kochhistorie läuft lokal über localStorage (später migrierbar auf Supabase).
 */

import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";
import { RECIPE_POOL } from "../data/recipePool";
import { WEEKLY_TIPS, WeeklyTip, getTipsForWeek } from "../data/weeklyTips";
import {
  findShopsNear,
  distanceMeters,
  osmMapLink,
  ShopLocation,
} from "./location";

export type Diet = "Vegan" | "Vegetarisch" | "Keto" | "Paleo" | "LowCarb" | "Mixed";
export type Priority = "guenstig" | "schnell" | "saison" | "proteinreich" | "lowGI";
export type ShopType = "lokal" | "online";
export type MealSlot = "frühstück" | "mittag" | "abend";

export interface RecipeCookingEntry {
  recipeId: string;
  cookedAt: string;
}

export interface UserPreferences {
  diet: Diet;
  allergies: string[];
  budgetPerWeek: number;
  priorities: Priority[];
  noWaste: boolean;
  householdSize: number;
  plz?: string;
  userLocation?: { lat: number; lon: number; label: string };
  maxRepetitionDays?: number;
  persistHistory?: boolean;
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

export interface DayPlan {
  date: string;
  meals: Record<MealSlot, RecipeItem[]>;
}

export interface WeekPlan {
  weekStart: string;
  days: DayPlan[];
  shoppingList: ShoppingListItem[];
  totalCost: number;
  noWasteTips: string[];
  generatedAt: string;
  cookedRecipeIds: string[];
  weeklyTips: WeeklyTip[];
  nearbyShops: ShopLocation[];
}

const COOKING_HISTORY_KEY = "fudi_cooking_history";

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

function scoreRecipe(
  recipe: RecipeItem,
  prefs: UserPreferences,
  history: RecipeCookingEntry[],
  maxRepetitionDays: number
): number {
  let score = 0;
  if (prefs.priorities.includes("schnell") && recipe.time <= 30) score += 2;
  if (prefs.priorities.includes("guenstig") && recipe.rating >= 4.0) score += 1;
  if (prefs.priorities.includes("proteinreich") && recipe.protein >= 20) score += 2;
  if (prefs.priorities.includes("lowGI") && recipe.gi === "low") score += 2;
  if (prefs.priorities.includes("saison")) score += 1;
  // Blutzucker-Regelung
  if (recipe.gi === "low") score += 2;
  if (recipe.impact <= 15) score += 1;
  if (recipe.impact > 25) score -= 1;
  // Wiederholung vermeiden: max 1x pro Monat
  const days = daysSinceLastCooked(recipe.id, history);
  if (days >= maxRepetitionDays) score += 2;
  else if (days < 7) score -= 5;
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

export async function generateWeekPlan(
  prefs: UserPreferences,
  weekStart: string = new Date().toISOString().split("T")[0]
): Promise<WeekPlan> {
  const start = new Date(weekStart);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // Montag

  const history = prefs.persistHistory !== false ? loadCookingHistory() : [];
  const maxRepetitionDays = prefs.maxRepetitionDays ?? 30;
  const allRecipes = [...RECIPES_DB, ...RECIPE_POOL];
  const candidates = allRecipes.filter((r) => matchesPreferences(r, prefs));

  if (candidates.length === 0) {
    return {
      weekStart: start.toISOString().split("T")[0],
      days: [],
      shoppingList: [],
      totalCost: 0,
      noWasteTips: ["Keine passenden Rezepte für deine Einstellungen gefunden."],
      generatedAt: new Date().toISOString(),
      cookedRecipeIds: [],
      weeklyTips: getTipsForWeek(0),
      nearbyShops: [],
    };
  }

  const MEAL_SLOTS: MealSlot[] = ["frühstück", "mittag", "abend"];
  const days: DayPlan[] = [];
  const ingredientUsage = new Map<string, number>();
  const weeklyUsage = new Map<string, number>();
  const cookedRecipeIds: string[] = [];

  for (let d = 0; d < 7; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];

    const meals: Record<MealSlot, RecipeItem[]> = {
      frühstück: [],
      mittag: [],
      abend: [],
    };

    for (const slot of MEAL_SLOTS) {
      const slotRecipes: RecipeItem[] = [];
      const sorted = [...candidates]
        .filter((r) => !slotRecipes.includes(r))
        .filter(
          (r) =>
            !meals.frühstück.includes(r) &&
            !meals.mittag.includes(r) &&
            !meals.abend.includes(r)
        )
        .sort((a, b) => {
          const daysA = daysSinceLastCooked(a.id, history);
          const daysB = daysSinceLastCooked(b.id, history);
          const recentlyA = daysA < maxRepetitionDays ? 1 : 0;
          const recentlyB = daysB < maxRepetitionDays ? 1 : 0;
          if (recentlyA !== recentlyB) return recentlyA - recentlyB;
          return (
            scoreRecipe(b, prefs, history, maxRepetitionDays) -
            scoreRecipe(a, prefs, history, maxRepetitionDays)
          );
        });

      for (const recipe of sorted) {
        if (slotRecipes.length >= 3) break;
        if ((weeklyUsage.get(recipe.id) || 0) >= 3) continue;
        slotRecipes.push(recipe);
        weeklyUsage.set(recipe.id, (weeklyUsage.get(recipe.id) || 0) + 1);
      }
      meals[slot] = slotRecipes;

      for (const recipe of slotRecipes) {
        cookedRecipeIds.push(recipe.id);
        for (const ing of recipe.ingredients) {
          const key = ing.name.toLowerCase();
          ingredientUsage.set(key, (ingredientUsage.get(key) || 0) + 1);
        }
      }
    }

    days.push({ date: dateStr, meals });
  }

  const allSelected = days.flatMap((day) => Object.values(day.meals).flat());
  const uniqueSelected = [...new Map(allSelected.map((r) => [r.id, r])).values()];

  const totalPortions = allSelected.reduce((sum, r) => sum + r.portions, 0);
  const factor = (prefs.householdSize * 7) / Math.max(totalPortions, 1);
  const rawIngredients = aggregateIngredients(allSelected, factor);

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
  if (prefs.noWaste) {
    const duplicates = Array.from(ingredientUsage.entries())
      .filter(([, count]) => count > 1)
      .map(([ingredient]) => ingredient);
    if (duplicates.length > 0) {
      noWasteTips.push(
        `Folgende Zutaten kommen mehrfach vor und können gemeinsam gekauft werden: ${duplicates.join(", ")}.`
      );
    }
    noWasteTips.push("Übrig gebliebene Gemüse-Reste eignen sich für Suppen oder Pfannen-Gerichte am Wochenende.");
    if (allSelected.length > 0) {
      noWasteTips.push("Plane Reste vom Mittagessen als Abendessen am selben Tag ein.");
    }
  }

  if (prefs.persistHistory !== false) {
    for (const id of cookedRecipeIds) {
      markRecipeCooked(id);
    }
  }

  const nearbyShops: ShopLocation[] = prefs.userLocation
    ? await findShopsNear(prefs.userLocation.lat, prefs.userLocation.lon, 5000)
        .then((shops) =>
          shops
            .map((s) => ({
              ...s,
              distance: distanceMeters(
                prefs.userLocation!.lat,
                prefs.userLocation!.lon,
                s.lat,
                s.lon
              ),
            }))
            .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
        )
    : [];

  return {
    weekStart: start.toISOString().split("T")[0],
    days,
    shoppingList,
    totalCost: Math.round(totalCost * 100) / 100,
    noWasteTips,
    generatedAt: new Date().toISOString(),
    cookedRecipeIds: uniqueSelected.map((r) => r.id),
    weeklyTips: getTipsForWeek(0),
    nearbyShops,
  };
}

export function formatPrice(eur: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(eur);
}

export function loadCookingHistory(): RecipeCookingEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COOKING_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecipeCookingEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCookingHistory(history: RecipeCookingEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      COOKING_HISTORY_KEY,
      JSON.stringify(history.slice(-500))
    );
  } catch {
    // still ignorieren
  }
}

export function markRecipeCooked(recipeId: string): void {
  const history = loadCookingHistory();
  history.push({
    recipeId,
    cookedAt: new Date().toISOString().split("T")[0],
  });
  saveCookingHistory(history);
}

export function daysSinceLastCooked(
  recipeId: string,
  history: RecipeCookingEntry[]
): number {
  const matches = history.filter((h) => h.recipeId === recipeId);
  if (matches.length === 0) return Infinity;
  const last = matches
    .sort((a, b) => b.cookedAt.localeCompare(a.cookedAt))[0].cookedAt;
  const lastDate = new Date(last + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today.getTime() - lastDate.getTime()) / 86400000));
}

export function isRecentlyCooked(
  recipeId: string,
  history: RecipeCookingEntry[],
  days: number
): boolean {
  return daysSinceLastCooked(recipeId, history) < days;
}