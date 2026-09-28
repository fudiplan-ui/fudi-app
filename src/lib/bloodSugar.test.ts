import { describe, expect, it } from "vitest";
import { estimateTdee, predictGlucose } from "./bloodSugar";

describe("predictGlucose", () => {
  it("berechnet Spitze ohne Swap korrekt", () => {
    const r = predictGlucose(54, 105, 1);
    expect(r.rawImpact).toBe(54);
    expect(r.originalPeak).toBe(159);
    expect(r.optimizedImpact).toBe(54);
    expect(r.optimizedPeak).toBe(159);
    expect(r.savedMgDl).toBe(0);
  });

  it("wendet Zutaten-Swap mit Portionsfaktor an", () => {
    // Pasta: baseImpact 54, Shirataki-Reduktion 46, Portionsfaktor 1
    const r = predictGlucose(54, 105, 1, 46);
    expect(r.optimizedImpact).toBe(8); // Minimum-Schutz greift (54-46=8)
    expect(r.optimizedPeak).toBe(113);
    expect(r.savedMgDl).toBe(46);
  });

  it("skaliert mit dem Portionsfaktor", () => {
    const r = predictGlucose(50, 100, 2, 20);
    expect(r.rawImpact).toBe(100);
    expect(r.originalPeak).toBe(200);
    expect(r.optimizedImpact).toBe(60); // 100 - 40
    expect(r.savedMgDl).toBe(40);
  });

  it("schützt vor negativen/midakten Portionsfaktoren (Fallback 1)", () => {
    const r1 = predictGlucose(50, 100, 0);
    expect(r1.rawImpact).toBe(50);
    const r2 = predictGlucose(50, 100, Number.NaN);
    expect(r2.rawImpact).toBe(50);
  });

  it("reduziert nie unter 8 mg/dL (medizinischer Plausibilitäts-Schutz)", () => {
    const r = predictGlucose(54, 105, 1, 1000);
    expect(r.optimizedImpact).toBe(8);
    expect(r.savedMgDl).toBe(46);
  });

  it("savedMgDl wird nie negativ, auch bei unlogischen Eingaben", () => {
    const r = predictGlucose(-10, 100, 1, 0);
    expect(r.savedMgDl).toBe(0);
  });
});

describe("estimateTdee", () => {
  it("berechnet Mifflin-St Jeor für Männer", () => {
    // 80kg, 180cm, 30 Jahre, männlich, sitzend
    const { bmr, tdee } = estimateTdee(80, 180, 1996, "maennlich", 0);
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(bmr).toBe(1780);
    expect(tdee).toBe(Math.round(1780 * 1.2));
  });

  it("berechnet Mifflin-St Jeor für Frauen", () => {
    const { bmr } = estimateTdee(65, 170, 1995, "weiblich", 2);
    // 650 + 1062.5 - 155 - 161 = 1396.5 → 1397 (Math.round)
    expect(bmr).toBe(1397);
  });

  it("verwendet Mittelwert bei 'divers' und unbekanntem Geschlecht", () => {
    const a = estimateTdee(70, 175, 1990, "divers", 2);
    const b = estimateTdee(70, 175, 1990, "", 2);
    expect(a.bmr).toBe(b.bmr);
  });

  it("aktive Nutzer bekommen höheren Faktor", () => {
    const sitting = estimateTdee(70, 175, 1990, "weiblich", 0);
    const active = estimateTdee(70, 175, 1990, "weiblich", 4);
    expect(active.tdee).toBeGreaterThan(sitting.tdee);
  });

  it("gibt 0 zurück bei unvollständigen Daten", () => {
    expect(estimateTdee(0, 175, 1990, "weiblich", 2).bmr).toBe(0);
    expect(estimateTdee(70, 0, 1990, "weiblich", 2).bmr).toBe(0);
    expect(estimateTdee(70, 175, 0, "weiblich", 2).bmr).toBe(0);
  });

  it("clamped Aktivitätslevel außerhalb 0–4", () => {
    const low = estimateTdee(70, 175, 1990, "weiblich", -5);
    const high = estimateTdee(70, 175, 1990, "weiblich", 99);
    expect(low.tdee).toBe(estimateTdee(70, 175, 1990, "weiblich", 0).tdee);
    expect(high.tdee).toBe(estimateTdee(70, 175, 1990, "weiblich", 4).tdee);
  });
});
