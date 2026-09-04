import { Outlet } from "react-router";
import Layout from "./Layout";

export default function Root() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
