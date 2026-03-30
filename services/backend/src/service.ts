import { startHTTPServer } from "#src/server";
import { uncaughtExceptionHandler } from "#src/utils/process";

uncaughtExceptionHandler();
await startHTTPServer();
