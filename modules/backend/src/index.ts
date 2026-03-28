import type { routes } from "./routes";
import type { z } from "zod";

export type RouteMap = typeof routes[number];

export type Path = RouteMap["config"]["path"];

export type RouteForPath<P extends Path> = Extract<RouteMap, { config: { path: P } }>;

export type InputForPath<P extends Path> = RouteForPath<P>["input"] extends undefined
  ? null
  : z.infer<RouteForPath<P>["input"]>;

export type OutputForPath<P extends Path> = RouteForPath<P>["output"] extends undefined
  ? null
  : z.infer<RouteForPath<P>["output"]>;
