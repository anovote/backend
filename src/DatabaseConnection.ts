import { ConnectionOptions, createConnection } from "./deps.ts";
import { config } from "./deps.ts";

export class DatabaseConnection {
  private dbConfig: ConnectionOptions = {
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

  databaseConnection = createConnection(this.dbConfig);

  constructor() {
  }

  async getDatabaseManager() {
    try {
      console.log(
        "Check your database: ",
        (await this.databaseConnection).isConnected,
      );
      return (await this.databaseConnection).manager;
    } catch (e) {
      console.log(e);
    }
  }
}
