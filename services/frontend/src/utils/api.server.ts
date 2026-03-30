import type { InputForPath, OutputForPath, RoutePath } from "@core-module/backend";
import { COOKIES } from "./cookie";
import { httpCookie } from "cookie-muncher";
import { AsyncLocalStorage } from "node:async_hooks";

export const asyncStorageRequest = new AsyncLocalStorage<Request>();

export const apiServer = async<P extends RoutePath>(path: P, body: InputForPath<P>): Promise<OutputForPath<P>> => {
  // Get the token if it found:
  const request = asyncStorageRequest.getStore();
  const cookies = httpCookie.parse(request?.headers.get("Cookie") ?? "");
  const token = cookies.find((cookie) => cookie.name === COOKIES.TOKEN)?.value;

  // Execute request:
  const response = await fetch(`http://localhost:3005${String(path)}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: token } : {}),
    },
    body: JSON.stringify(body),
  });

  // Error handling:
  if (!response.ok || response.status !== 200) {
    const isJSONResponse = response.headers.get("content-type")?.includes("json") || false;
    const body = isJSONResponse ? await response.clone().json() as string : await response.clone().text();

    throw new Error(isJSONResponse ? JSON.stringify(body, null, 2) : body);
  }

  // Return json output:
  return await response.json() as OutputForPath<P>;
};
