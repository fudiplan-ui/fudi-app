import { useEffect } from "react";

const SITE_URL = "https://fudi-app-psi.vercel.app";
const DEFAULT_TITLE = "FUDI 2.0 – Smarte KI-Ernährung & Blutzucker-Vorhersage";
const DEFAULT_DESCRIPTION =
  "FUDI: Gesunde Mahlzeiten mit KI-Blutzucker-Vorhersage, Kühlschrank-Scan, glykämischem Index und automatischem Preisvergleich. Für Diabetiker, Sportler und gesunden Genuss.";

/** Titel + Beschreibung je Route (Prefix-Matching, erste Übereinstimmung gewinnt). */
const ROUTE_META: Array<{ match: RegExp; title: string; description: string }> = [
  { match: /^\/$/, title: "FUDI 2.0 – Smarte KI-Ernährung & Blutzucker-Vorhersage", description: DEFAULT_DESCRIPTION },
  { match: /^\/login$/, title: "Anmelden", description: "Melde dich bei deinem FUDI-Konto an." },
  { match: /^\/(register|registrieren)$/, title: "Konto erstellen", description: "Erstelle dein persönliches FUDI-Ernährungsprofil – kostenlos in 2 Minuten." },
  { match: /^\/(rezepte|recipes)(\/|$)/, title: "Rezepte suchen", description: "1.240 gesunde internationale Rezepte filtern – nach Diät, Allergien, GI, Makros und Land." },
  { match: /^\/(blutzucker|tagebuch|diary)$/, title: "Blutzucker-Rechner & Tagebuch", description: "Simuliere den glykämischen Peak deiner Mahlzeiten und finde Swaps, die die Spitze glätten." },
  { match: /^\/(planer|week-planner|wochenplan)$/, title: "Wochenplaner", description: "Plane deine Woche mit einem Klick – automatische Mahlzeitenplanung inklusive Einkaufsliste." },
  { match: /^\/(einkauf|shopping-list|einkaufsliste)$/, title: "Einkaufsliste", description: "Deine Einkaufsliste mit Supermarkt-Deals und Grundpreis-Vergleich." },
  { match: /^\/(stats|dashboard)$/, title: "Dashboard & Statistiken", description: "Dein FUDI-Überblick: Mahlzeiten, Blutzucker, Wasserhaushalt und Fortschritt." },
  { match: /^\/(profil|profile)$/, title: "Profil", description: "Dein persönliches FUDI-Profil, metabolische Parameter und Einstellungen." },
  { match: /^\/(preise|pricing)$/, title: "Preise & Abos", description: "FUDI kostenlos nutzen oder PRO freischalten – transparent, fair, jederzeit kündbar." },
  { match: /^\/(fitness|training)$/, title: "Fitness-Tracker", description: "Trainingsplan, Ausführungskarten und Netto-Kalorien im Abgleich mit deinem Blutzucker." },
  { match: /^\/impressum$/, title: "Impressum", description: "Impressum der FUDI Health Technologies." },
  { match: /^\/datenschutz$/, title: "Datenschutz", description: "Datenschutzerklärung von FUDI gemäß DSGVO." },
];

/** Liefert Title/Description für einen Pfad (Fallback = 404/Default). */
export function routeMeta(pathname: string): { title: string; description: string } {
  const hit = ROUTE_META.find((r) => r.match.test(pathname));
  if (!hit) {
    return {
      title: "Seite nicht gefunden",
      description: "Diese Seite existiert nicht oder wurde verschoben.",
    };
  }
  return { title: hit.title, description: hit.description };
}

function upsertMeta(attr: "name" | "property", key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Wendet Title/Meta/Canonical/OG für den aktuellen Pfad an (zentral, aufgerufen aus Root). */
export function applyRouteMeta(pathname: string): void {
  const { title, description } = routeMeta(pathname);
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | FUDI`;
  const url = SITE_URL + pathname;

  document.title = fullTitle;
  upsertMeta("name", "description", description);
  upsertMeta("property", "og:title", fullTitle);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:type", "website");
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", fullTitle);
  upsertMeta("name", "twitter:description", description);
  upsertCanonical(url);
}

/**
 * Setzt document.title + Meta-Tags pro Route (SPA-tauglich, ohne Library).
 * Seitenübergreifend wird das zentral aus Root.tsx gerufen; diese Hook eignet
 * sich für dynamische Titel (z. B. Rezeptdetail mit Rezeptnamen).
 */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    const fullTitle = title ? `${title} | FUDI` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
  }, [title, description]);
}

