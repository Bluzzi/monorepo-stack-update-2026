import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/ping", "./routes/ping.tsx"),
  route("*", "./routes/not-found.tsx"),
] satisfies RouteConfig;
