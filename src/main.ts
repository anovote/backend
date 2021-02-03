/**
 * Just some example code to se if the orm database application is running
 */

import { HTTPServer } from "./httpServer.ts";

const httpServer = new HTTPServer();
await httpServer.runHTTPServer();
