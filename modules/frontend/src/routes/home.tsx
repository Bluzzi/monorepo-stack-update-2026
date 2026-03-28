import type { Route } from "./+types/home";
import { apiServer } from "#/utils/api";

export const meta = (_: Route.MetaArgs) => {
  return [
    { title: "Stack Update" },
    { name: "description", content: "The 2026 stack update!" },
  ];
};

export const loader = async (_: Route.LoaderArgs) => {
  const data = await apiServer("/get_players", { ping: "pong" });
  return { data };
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  return (
    <main className="bg-black">
      <p className="text-xl">{JSON.stringify(loaderData.data)}</p>
    </main>
  );
};

export default Page;
