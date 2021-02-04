/**
 * Just some example code to se if the orm database application is running
 */
import { ConnectionOptions, createConnection } from "./deps.ts";
import { Election } from "./entity/Election.ts";
import { ElectionOrganizer } from "./entity/ElectionOrganizer.ts";
import { EligibleVoter } from "./entity/EligibleVoter.ts";
import { config } from "./deps.ts";
import { HTTPServer } from "./httpServer.ts";

const dbConfig: ConnectionOptions = {
  type: "postgres",
  host: config.get("DB_HOST"),
  port: Number.parseInt(config.get("DB_PORT")!),
  username: config.get("POSTGRES_USER"),
  password: config.get("POSTGRES_PASSWORD"),
  database: config.get("POSTGRES_DB"),
  entities: [
    Deno.cwd() + "/src/entity/**/*.ts",
  ],
  synchronize: true,
};

export const dbConnection = await createConnection(dbConfig);

try {
  /** ADD SOME TEST DATA */
  const eOrg = new ElectionOrganizer();
  eOrg.firstName = "Hjalmar";
  eOrg.lastName = "Andersen";
  eOrg.email = "hjallis@gmail.com";
  eOrg.password = "test123";
  eOrg.elections = [];

  const election = new Election();
  election.electionOrganizer = eOrg;

  await dbConnection.manager.save(eOrg);

  console.log("Check your database: ", dbConnection.isConnected);
} catch (e) {
  console.log(e);
}

const httpServer = new HTTPServer();
await httpServer.runHTTPServer();
