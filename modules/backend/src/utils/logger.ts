import { Temporal } from "@js-temporal/polyfill";
import { styleText } from "util";
import { transports, createLogger, format } from "winston";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const transportConsole = new transports.Console({
  format: format.printf(({ level, message }) => {
    const datetime = formatter.format(Temporal.Now.instant().epochMilliseconds);

    const type: string = {
      info: styleText(["bgBlueBright", "black"], "INFO"),
      error: styleText(["bgRed", "black"], "OUPS"),
      warn: styleText(["bgYellow", "black"], "WARN"),
    }[level] ?? styleText(["bgGreen", "black"], "UNKN");

    return `${styleText("underline", datetime)} ${type} ${typeof message === "string" ? message : JSON.stringify(message)}`;
  }),
});

const winstonLogger = createLogger({
  transports: [transportConsole],
});

export const logger = {
  info: (message: string): void => {
    winstonLogger.info(message);
  },

  error: (message: string, stack?: string): void => {
    winstonLogger.error(`${message}${stack ? `\n${stack}` : ""}`);
  },

  warn: (message: string): void => {
    winstonLogger.warn(message);
  },
};
