import type { routes } from "./routes";
import type { z } from "zod";

export type BackendRouteMap = typeof routes[number];

export type BackendPath = BackendRouteMap["config"]["path"];

export type BackendRouteForPath<P extends BackendPath> = Extract<BackendRouteMap, { config: { path: P } }>;

export type BackendInputForPath<P extends BackendPath> = BackendRouteForPath<P>["input"] extends undefined
  ? null
  : z.infer<BackendRouteForPath<P>["input"]>;

export type BackendOutputForPath<P extends BackendPath> = BackendRouteForPath<P>["output"] extends undefined
  ? null
  : z.infer<BackendRouteForPath<P>["output"]>;

export type BackendResourcesProvidedForPath<P extends BackendPath> = BackendRouteForPath<P>["config"]["resources"]["provides"];
export type BackendResourcesInvalidatedForPath<P extends BackendPath> = BackendRouteForPath<P>["config"]["resources"]["invalidates"];
