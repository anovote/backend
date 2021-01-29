import { every, FileStream, of } from "https://deno.land/x/optic/streams/fileStream/mod.ts";
import { Level, Logger, LogRecord, Stream, TimeUnit } from "https://deno.land/x/optic/mod.ts";
import { JsonFormatter } from "https://deno.land/x/optic/formatters/mod.ts";
import { PropertyRedaction } from "https://deno.land/x/optic/transformers/propertyRedaction.ts";

const fileStream = new FileStream("logFile.txt")
  .withMinLogLevel(Level.Warn)
  .withFormat(
    new JsonFormatter()
    .withPrettyPrintIndentation(2)
    .withDateTimeFormat("YYYY.MM.DD hh:mm:ss:SSS")
  )
  .withBufferSize(10000)
  .withLogFileInitMode("append")
  .withLogFileRotation(
    every(200000).bytes().withLogFileRetentionPolicy(of(7).days()),
  )
  .withLogHeader(true)
  .withLogFooter(true);

// Configure the logger
export const fileLogger = new Logger()
  .withMinLogLevel(Level.Warn)
  .addFilter((stream: Stream, logRecord: LogRecord) => logRecord.msg === "spam")
  .addTransformer(new PropertyRedaction("password"))
  .addStream(fileStream);

export const logger = new Logger();