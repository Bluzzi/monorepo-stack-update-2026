import { startHTTPServer } from "#/server";
import { uncaughtExceptionHandler } from "#/utils/process";

uncaughtExceptionHandler();
await startHTTPServer();
