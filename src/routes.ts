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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,            Component: Landing },
      { path: "login",          Component: Login },
      { path: "register",       Component: RegisterPage },
      { path: "dashboard",      Component: Dashboard },
      { path: "rezepte",        Component: RecipeSearch },
      { path: "rezepte/:id",    Component: RecipeDetail },
      { path: "blutzucker",     Component: BloodSugar },
      { path: "planer",         Component: WeekPlanner },
      { path: "einkauf",        Component: ShoppingList },
      { path: "stats",          Component: Stats },
      { path: "profil",         Component: Profile },
      { path: "preise",         Component: Pricing },
    ],
  },
]);
