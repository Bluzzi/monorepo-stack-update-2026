import type { Route } from "./+types/home";
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { apiClient } from "#/utils/api.client.js";
import { apiServer } from "#/utils/api.server.js";

export const meta = (_: Route.MetaArgs) => {
  return [
    { title: "Stack Update" },
    { name: "description", content: "The 2026 stack update!" },
  ];
};

export const loader = async (_: Route.LoaderArgs) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["players"],
    queryFn: async () => apiServer("/get_players", { ping: "pong" }),
  });

  return { dehydratedState: dehydrate(queryClient) };
};

const PageComponent = () => {
  const { data } = useQuery({
    queryKey: ["players"],
    queryFn: async () => apiClient("/get_players", { ping: "pong" }),
  });

  return (
    <main className="bg-black">
      <p className="text-xl">{JSON.stringify(data)}</p>
    </main>
  );
};

const Page = ({ loaderData }: Route.ComponentProps) => (
  <HydrationBoundary state={loaderData.dehydratedState}>
    <PageComponent />
  </HydrationBoundary>
);

export default Page;
