/**
 * Blutzucker-Berechnungen (rein, testbar, ohne React).
 *
 * Modellbasierte Schätzung der postprandialen Glukose-Spitze in Anlehnung an
 * Glycemic Index / Glycemic Load. KEINE medizinische Berechnung – Disclaimer
 * in Layout.tsx bleibt gültig.
 */

export interface GlucosePrediction {
  /** Anstieg ohne Swap (mg/dL) */
  rawImpact: number;
  /** Spitze ohne Swap (mg/dL) */
  originalPeak: number;
  /** Anstieg mit Swap (mg/dL) */
  optimizedImpact: number;
  /** Spitze mit Swap (mg/dL) */
  optimizedPeak: number;
  /** Eingesparte mg/dL (>= 0) */
  savedMgDl: number;
}

/**
 * Berechnet die Blutzucker-Spitze einer Mahlzeit mit und ohne Zutaten-Swap.
 * @param baseImpact mg/dL-Anstieg der Portion (Referenz)
 * @param startBs Nüchtern-/Startwert (mg/dL)
 * @param portionFactor Portionsfaktor (0.5 – 2.0)
 * @param swapReduction Reduktion des Swaps in mg/dL (Referenz, vor Portionsfaktor)
 */
export function predictGlucose(
  baseImpact: number,
  startBs: number,
  portionFactor: number,
  swapReduction: number = 0
): GlucosePrediction {
  const factor = Number.isFinite(portionFactor) && portionFactor > 0 ? portionFactor : 1;
  const rawImpact = Math.round(baseImpact * factor);
  const originalPeak = startBs + rawImpact;

  const reduction = Math.round(swapReduction * factor);
  const optimizedImpact = Math.max(8, rawImpact - reduction);
  const optimizedPeak = startBs + optimizedImpact;
  const savedMgDl = Math.max(0, originalPeak - optimizedPeak);

  return { rawImpact, originalPeak, optimizedImpact, optimizedPeak, savedMgDl };
}

/**
 * Tagesbedarf (Mifflin-St Jeor) + Aktivitätsfaktor.
 * activityLevel: 0 (sitzend) … 4 (extrem aktiv)
 */
export function estimateTdee(
  weightKg: number,
  heightCm: number,
  birthYear: number,
  gender: "maennlich" | "weiblich" | "divers" | "",
  activityLevel: number
): { bmr: number; tdee: number } {
  if (!weightKg || !heightCm || !birthYear) return { bmr: 0, tdee: 0 };
  const age = new Date().getFullYear() - birthYear;
  // Bei "divers" wird der Mittelwert beider Geschlechter verwendet.
  const genderOffset = gender === "maennlich" ? 5 : gender === "weiblich" ? -161 : -78;
  const bmr = Math.round(
    10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset
  );
  const factors = [1.2, 1.375, 1.55, 1.725, 1.9];
  const factor = factors[Math.min(Math.max(activityLevel, 0), 4)] ?? 1.55;
  return { bmr, tdee: Math.round(bmr * factor) };
}
