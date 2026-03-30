import type { Route } from "./+types/home";

export const loader = (_: Route.LoaderArgs) => {
  return new Response("Page not found", { status: 404 });
};
