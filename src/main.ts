import { DatabaseConnection } from "./DatabaseConnection.ts";
import { HTTPServer } from "./httpServer.ts";

const dbC = new DatabaseConnection();
dbC.startDatabaseConnection();
const httpServer = new HTTPServer();
httpServer.runHTTPServer();
