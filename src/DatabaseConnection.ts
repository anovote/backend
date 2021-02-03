import { ConnectionOptions, createConnection } from "./deps.ts";
import { config } from "./deps.ts";
/**
 * Just some example code to se if the orm database application is running
 */
export class DatabaseConnection {
  dbConfig: ConnectionOptions = {
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

  constructor() {
  }

  async startDatabaseConnection() {
    try {
      const connection = await createConnection(this.dbConfig);

      console.log("Check your database: ", connection.isConnected);
    } catch (e) {
      console.log(e);
    }
  }
}
