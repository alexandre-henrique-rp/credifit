import {
  type RouteConfig,
  index,
  layout,
  route
} from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [
    index("pages/home.tsx"),
    route("/credito", "pages/credito.tsx")
  ]),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx")
] satisfies RouteConfig;
