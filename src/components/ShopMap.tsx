/**
 * FUDI ShopMap – Lebensmittelgeschäfte in der Nähe anzeigen.
 *
 * Nutzt OpenStreetMap (Open Source) für Links und Geocoding.
 * Keine externe Library nötig – funktioniert sofort.
 */

import { ShopLocation, osmMapLink } from "../lib/location";

export interface ShopMapProps {
  shops: ShopLocation[];
  userLocation?: { lat: number; lon: number; label: string };
  onShopSelect?: (shop: ShopLocation) => void;
}

export function ShopMap({ shops, userLocation, onShopSelect }: ShopMapProps) {
  if (shops.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: "#e5e7eb" }}>
        <h3 className="font-bold text-slate-900 mb-3">🏪 Geschäfte in der Nähe</h3>
        <p className="text-sm text-slate-500">
          Keine Geschäfte gefunden. Gib deine PLZ oder Stadt ein, um Supermärkte, Bäckereien und Märkte in deiner Umgebung zu entdecken.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: "#e5e7eb" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">
          🏪 Geschäfte in der Nähe ({shops.length})
        </h3>
        <p className="text-xs text-slate-500">OpenStreetMap-Daten</p>
      </div>

      <div className="space-y-3">
        {shops.map((shop) => (
          <div
            key={shop.id}
            onClick={() => onShopSelect?.(shop)}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                  {shop.name}
                </span>
                {shop.distance != null && (
                  <span className="text-xs text-slate-400">· {(shop.distance / 1000).toFixed(1)} km</span>
                )}
              </div>
              {shop.address && (
                <p className="text-xs text-slate-600 truncate">{shop.address}</p>
              )}
              <a
                href={osmMapLink(shop.lat, shop.lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:text-emerald-800 underline underline-offset-4 mt-1 inline-block"
              >
                🗺️ Auf OpenStreetMap anzeigen
              </a>
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700">
              {shop.type.charAt(0).toUpperCase() + shop.type.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {userLocation && (
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-600 mb-2">
            📍 Dein Standort: <strong>{userLocation.label}</strong>
          </p>
          <a
            href={osmMapLink(userLocation.lat, userLocation.lon)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 hover:text-emerald-800 underline underline-offset-4"
          >
            🗺️ Deinen Standort auf OpenStreetMap anzeigen
          </a>
        </div>
      )}
    </div>
  );
}