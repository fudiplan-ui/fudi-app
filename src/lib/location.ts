/**
 * FUDI Location – Open Source Geocoding & Shops in der Nähe.
 *
 * Nutzt ausschließlich öffentliche Open-Source-Dienste:
 * - Nominatim (OpenStreetMap) für Adresse → Koordinaten
 * - Overpass API für Supermärkte/Lebensmittelgeschäfte im Umkreis
 *
 * RECHTLICH: ODbL-Lizenz (OpenStreetMap). Für Produktion eigene Instanz empfohlen.
 */

export interface Location {
  lat: number;
  lon: number;
  display_name: string;
}

export interface ShopLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  type: "supermarket" | "bakery" | "butcher" | "market" | "other";
  distance?: number; // Meter
}

/**
 * Geocode: Adresse / PLZ → Koordinaten (Nominatim).
 */
export async function geocodeAddress(query: string): Promise<Location[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url, {
    headers: { "User-Agent": "FUDI-WeekPlanner/1.0" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    display_name: item.display_name,
  }));
}

/**
 * Shops in der Nähe finden (Overpass API).
 * sucht nach shop=supermarket, bakery, butcher, market im Umkreis (Meter).
 */
export async function findShopsNear(
  lat: number,
  lon: number,
  radiusMeters: number = 5000
): Promise<ShopLocation[]> {
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
      node["shop"="bakery"](around:${radiusMeters},${lat},${lon});
      node["shop"="butcher"](around:${radiusMeters},${lat},${lon});
      node["shop"="market"](around:${radiusMeters},${lat},${lon});
    );
    out center tags;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "FUDI-WeekPlanner/1.0",
      },
    });
    if (!res.ok) return [];
    const data = await res.json();

    return data.elements.map((el: any, idx: number) => {
      const tags = el.tags || {};
      const shopType = tags.shop || "other";
      return {
        id: `osm-${el.type}-${el.id}`,
        name: tags.name || shopType.charAt(0).toUpperCase() + shopType.slice(1),
        lat: el.lat ?? el.center?.lat ?? 0,
        lon: el.lon ?? el.center?.lon ?? 0,
        address: [
          tags["addr:housenumber"],
          tags["addr:street"],
          tags["addr:postcode"],
          tags["addr:city"],
        ]
          .filter(Boolean)
          .join(" ") || undefined,
        type: (["supermarket", "bakery", "butcher", "market"] as string[]).includes(
          shopType
        )
          ? (shopType as any)
          : "other",
      };
    });
  } catch {
    return [];
  }
}

/**
 * Entfernung zwischen zwei Koordinaten (Haversine, Meter).
 */
export function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * OSM Link für eine Position.
 */
export function osmMapLink(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/#map=16/${lat}/${lon}`;
}