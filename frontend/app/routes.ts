import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("/login", "pages/login.tsx"),
  layout("layout.tsx", [
    index("pages/home.tsx")

  ]),
] satisfies RouteConfig;
