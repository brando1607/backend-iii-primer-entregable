import { Command } from "commander";
const args = new Command();

args.option("-p <port>", "port", 9000);
args.option("-m <mode>", "mode", "prod");

args.parse();

export const argsConfig = args.opts();
