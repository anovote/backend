import { ConsoleStream, Logger } from "https://deno.land/x/optic/mod.ts";
import { JsonFormatter } from "https://deno.land/x/optic/formatters/json.ts";

export const logger = new Logger();
logger.addStream(new ConsoleStream().withFormat(new JsonFormatter()));