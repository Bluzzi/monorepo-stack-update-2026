import type { Route } from "./+types/root";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { asyncStorageRequest } from "#/utils/api.server";
import { useState, type ReactNode } from "react";
import { isRouteErrorResponse, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";

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
      </head>
      <body>
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
        console.log("Error from Tanstack QueryClient", error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.log("Error from Tanstack QueryClient", error);
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
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
