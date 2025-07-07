import {
  type RouteConfig,
  index,
  layout,
  route
} from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [route("/", "pages/home.tsx")]),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),
] satisfies RouteConfig;
