import type { BackendInputForPath, BackendOutputForPath, BackendPath } from "@core-service/backend";
import { COOKIES } from "./cookie";
import { domCookie } from "cookie-muncher";

export const apiClient = async<P extends BackendPath>(path: P, body: BackendInputForPath<P>): Promise<BackendOutputForPath<P>> => {
  // Get the token if it found:
  const token = domCookie.get(COOKIES.TOKEN)?.value;

  // Execute request:
  const response = await fetch(`http://localhost:3005${path}`, {
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
  return await response.json() as BackendOutputForPath<P>;
};
