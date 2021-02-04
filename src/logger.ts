import {
  every,
  FileStream,
  of,
} from "https://deno.land/x/optic/streams/fileStream/mod.ts";
import {
  ConsoleStream,
  Level,
  Logger,
  LogRecord,
  Stream,
  TimeUnit,
} from "https://deno.land/x/optic/mod.ts";
import {
  JsonFormatter,
  TokenReplacer,
} from "https://deno.land/x/optic/formatters/mod.ts";
import { PropertyRedaction } from "https://deno.land/x/optic/transformers/propertyRedaction.ts";

let dateTime = new Date();
const logFilePath: string = "./logFile-" + dateTime + ".log";

/**
 * A logger which contains two logging streams:
 *  A console logger which logs into the console,
 *  which will log everything with logging "Debug" level and higher.
 *  A file logger which logs to an .log file on a JSON format,
 *  which will log everything with logging "Error" level and higher.
 */
export const logger = new Logger()
  .addStream(
    new ConsoleStream()
      .withMinLogLevel(Level.Debug)
      .withFormat(
        new TokenReplacer()
          .withColor()
          .withDateTimeFormat("YYYY.MM.DD hh:mm:ss:SSS"),
      ),
  )
  .addStream(
    new FileStream(logFilePath)
      .withMinLogLevel(Level.Error)
      .withFormat(
        new JsonFormatter()
          .withPrettyPrintIndentation(2)
          .withDateTimeFormat("YYYY.MM.DD hh:mm:ss:SSS"),
      )
      .withBufferSize(30000)
      .withLogFileInitMode("append")
      .withLogFileRotation(
        every(2000000).bytes().withLogFileRetentionPolicy(of(7).days()),
      )
      .withLogHeader(true)
      .withLogFooter(true),
  );
