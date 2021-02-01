import {
  every,
  FileStream,
  of,
} from "https://deno.land/x/optic/streams/fileStream/mod.ts";
import {
  Level,
  Logger,
  LogRecord,
  Stream,
  TimeUnit,
  ConsoleStream,
} from "https://deno.land/x/optic/mod.ts";
import { 
  JsonFormatter, 
  TokenReplacer,
} from "https://deno.land/x/optic/formatters/mod.ts";
import { PropertyRedaction } from "https://deno.land/x/optic/transformers/propertyRedaction.ts";

let dateTime = new Date();
const logFilePath: string = "data/logs/logFile-" + dateTime + ".log";

export const logger = new Logger()
  .addStream(new ConsoleStream() 
    .withMinLogLevel(Level.Debug)
    .withFormat(
      new TokenReplacer()
        .withColor()
        .withDateTimeFormat("YYYY.MM.DD hh:mm:ss:SSS")
    )
  )
  .addStream(new FileStream(logFilePath)
    .withMinLogLevel(Level.Error)
    .withFormat(new JsonFormatter()
      .withPrettyPrintIndentation(2)
      .withDateTimeFormat("YYYY.MM.DD hh:mm:ss:SSS")
    )
    .withBufferSize(30000)
    .withLogFileInitMode("append")
    .withLogFileRotation(
      every(2000000).bytes().withLogFileRetentionPolicy(of(7).days()),
    )
    .withLogHeader(true)
    .withLogFooter(true)
  );