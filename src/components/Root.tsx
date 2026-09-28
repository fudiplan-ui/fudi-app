import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Layout from "./Layout";
import { applyRouteMeta } from "../lib/seo";

export default function Root() {
  const location = useLocation();

  // Zentrale SEO-Meta pro Route (einzige Quelle – Seiten setzen keine eigenen
  // Titel, damit nie ein veralteter Titel nach Route-Wechsel stehen bleibt).
  useEffect(() => {
    applyRouteMeta(location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
