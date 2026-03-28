import { AsyncLocalStorage } from "node:async_hooks";

export const asyncStorageRequest = new AsyncLocalStorage<Request>();
