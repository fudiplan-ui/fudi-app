import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Landing from "./pages/Landing";
import Login, { RegisterPage } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecipeSearch from "./pages/RecipeSearch";
import RecipeDetail from "./pages/RecipeDetail";
import BloodSugar from "./pages/BloodSugar";
import WeekPlanner from "./pages/WeekPlanner";
import ShoppingList from "./pages/ShoppingList";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import FitnessTracker from "./pages/FitnessTracker";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,            Component: Landing },
      { path: "login",          Component: Login },
      { path: "register",       Component: RegisterPage },
      { path: "registrieren",   Component: RegisterPage },
      { path: "dashboard",      Component: Dashboard },
      // Recipes (both German and English URLs)
      { path: "rezepte",        Component: RecipeSearch },
      { path: "recipes",        Component: RecipeSearch },
      { path: "rezepte/:id",    Component: RecipeDetail },
      { path: "recipe/:id",     Component: RecipeDetail },
      { path: "recipes/:id",    Component: RecipeDetail },
      // Blood sugar & Diary
      { path: "blutzucker",     Component: BloodSugar },
      { path: "tagebuch",       Component: BloodSugar },
      { path: "diary",          Component: BloodSugar },
      // Planner
      { path: "planer",         Component: WeekPlanner },
      { path: "week-planner",   Component: WeekPlanner },
      { path: "wochenplan",     Component: WeekPlanner },
      // Shopping list
      { path: "einkauf",        Component: ShoppingList },
      { path: "shopping-list",  Component: ShoppingList },
      { path: "einkaufsliste",  Component: ShoppingList },
      // Stats & Profile
      { path: "stats",          Component: Stats },
      { path: "profil",         Component: Profile },
      { path: "profile",        Component: Profile },
      // Pricing & Business
      { path: "preise",         Component: Pricing },
      { path: "pricing",        Component: Pricing },
      // Fitness & Training
      { path: "fitness",        Component: FitnessTracker },
      { path: "training",       Component: FitnessTracker },
    ],
  },
]);
