import { createLogger, format, addColors, transports } from "winston";

const { Console, File } = transports;
const { colorize, simple } = format;
const colors = { fatal: "red", error: "yellow", info: "blue", http: "white" };
const levels = { fatal: 0, error: 1, info: 2, http: 3 };
addColors(colors);

export const logger = createLogger({
  levels,
  format: colorize(),
  transports: [new Console({ level: "http", format: simple() })],
});
