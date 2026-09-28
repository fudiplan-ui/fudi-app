import { Navigate, useLocation } from "react-router";
import { useAuth } from "../lib/authContext";
import type { ReactNode } from "react";

/**
 * Schützt App-Routen: Ohne Session wird auf /login umgeleitet,
 * die Ziel-URL wird über "from" mitgeschickt (Login springt danach zurück).
 * Öffentliche Seiten (Landing, Rezepte, Preise, Blutzucker) sind NICHT geschützt.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }
  return <>{children}</>;
}
