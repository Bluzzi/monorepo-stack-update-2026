import type { Route } from "./+types/root";
import { Toaster } from "@core-package/ui-kit/ui";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { asyncStorageRequest } from "#src/utils/api.server";
import { useState, type ReactNode } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "@core-package/ui-kit/tailwind.css";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ request }, next) => {
    return asyncStorageRequest.run(request, async () => next());
  },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        // https://stackoverflow.com/questions/75337953/what-causes-nextjs-warning-extra-attributes-from-the-server-data-new-gr-c-s-c
        suppressHydrationWarning={true}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
      /**
       * With SSR, we usually want to set some default staleTime
       * above 0 to avoid refetching immediately on the client.
       */
        staleTime: 60_000,

        refetchOnWindowFocus: "always",
        refetchInterval: 30_000,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        console.log("Error from Tanstack QueryClient (query)", error);
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: async (_data, _variables, _context, mutation) => {
        /**
         * Mutation keys are used as resource-based invalidation tokens for queries.
         *
         * This differs from TanStack Query's default invalidation model, where
         * `invalidateQueries({ queryKey: ["todos"] })` matches queries by hierarchical
         * prefix — i.e. any query whose key starts with ["todos"], respecting order
         * and position.
         * @see {@link https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation}
         *
         * Here, we treat each element of the mutation key as an independent token:
         * a query is invalidated if *any* of its key elements (at any position) matches
         * *any* element of the mutation key. There is no hierarchy or ordering — each
         * string token is a flat, unordered resource identifier.
        */
        const mutationKey = mutation.options.mutationKey ?? [];
        await queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.some(
            (key) => typeof key === "string" && mutationKey.includes(key),
          ),
        });
      },
      onError: (error) => {
        console.log("Error from Tanstack QueryClient (mutation)", error);
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />

      <Outlet />
    </QueryClientProvider>
  );
}

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details
      = error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  }
  else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
};
