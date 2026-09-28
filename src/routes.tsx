import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import RequireAuth from "./components/RequireAuth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Lazy-Loading: Die 2,9 MB große Rezeptdatenbank wird nur noch geladen,
// wenn eine Seite sie wirklich braucht (reduziert First-Load drastisch).
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.RegisterPage }))
);
const Dashboard = lazy(() => import("./pages/Dashboard"));
const RecipeSearch = lazy(() => import("./pages/RecipeSearch"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const BloodSugar = lazy(() => import("./pages/BloodSugar"));
const WeekPlanner = lazy(() => import("./pages/WeekPlanner"));
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const Stats = lazy(() => import("./pages/Stats"));
const Profile = lazy(() => import("./pages/Profile"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FitnessTracker = lazy(() => import("./pages/FitnessTracker"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));

/** Zeigt einen Lade-Spinner während eines Route-Chunks nachgeladen wird. */
function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <span
        className="inline-block w-7 h-7 border-[3px] rounded-full animate-spin"
        style={{ borderColor: "#2D5016", borderTopColor: "transparent" }}
      />
      <p className="text-xs font-semibold" style={{ color: "#6B705C" }}>
        Wird geladen …
      </p>
    </div>
  );
}

/** Hülle für lazy geladene Seiten (Suspense-Boundary je Route). */
function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  const Wrapped = () => (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );
  return Wrapped;
}

/** Geschützte Route: Leitet nicht eingeloggte Nutzer mit "from"-Merker um. */
function withAuth(Component: React.LazyExoticComponent<React.ComponentType>) {
  const Wrapped = () => (
    <RequireAuth>
      <Suspense fallback={<PageFallback />}>
        <Component />
      </Suspense>
    </RequireAuth>
  );
  return Wrapped;
}

const APP_ROUTES = [
  { path: "dashboard", Component: withAuth(Dashboard) },
  { path: "stats", Component: withAuth(Stats) },
  { path: "profil", Component: withAuth(Profile) },
  { path: "profile", Component: withAuth(Profile) },
  { path: "planer", Component: withAuth(WeekPlanner) },
  { path: "week-planner", Component: withAuth(WeekPlanner) },
  { path: "wochenplan", Component: withAuth(WeekPlanner) },
  { path: "einkauf", Component: withAuth(ShoppingList) },
  { path: "shopping-list", Component: withAuth(ShoppingList) },
  { path: "einkaufsliste", Component: withAuth(ShoppingList) },
  { path: "fitness", Component: withAuth(FitnessTracker) },
  { path: "training", Component: withAuth(FitnessTracker) },
];

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: withSuspense(Login) },
      { path: "register", Component: withSuspense(Register) },
      { path: "registrieren", Component: withSuspense(Register) },
      // Öffentliche Seiten
      { path: "rezepte", Component: withSuspense(RecipeSearch) },
      { path: "recipes", Component: withSuspense(RecipeSearch) },
      { path: "rezepte/:id", Component: withSuspense(RecipeDetail) },
      { path: "recipe/:id", Component: withSuspense(RecipeDetail) },
      { path: "recipes/:id", Component: withSuspense(RecipeDetail) },
      { path: "blutzucker", Component: withSuspense(BloodSugar) },
      { path: "tagebuch", Component: withSuspense(BloodSugar) },
      { path: "diary", Component: withSuspense(BloodSugar) },
      { path: "preise", Component: withSuspense(Pricing) },
      { path: "pricing", Component: withSuspense(Pricing) },
      { path: "impressum", Component: withSuspense(Impressum) },
      { path: "datenschutz", Component: withSuspense(Datenschutz) },
      // App-seitige Routen (Login erforderlich)
      ...APP_ROUTES,
      // 404 – muss der letzte Eintrag bleiben
      { path: "*", Component: NotFound },
    ],
  },
]);

