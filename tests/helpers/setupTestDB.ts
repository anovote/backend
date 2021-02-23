import config from '@/config'
import { Connection, createConnection } from 'typeorm'

let databaseConnectionPromise: Promise<Connection>
let { database } = config
/**
 * Singleton database connection
 */
async function setupConnection() {
  if (databaseConnectionPromise) {
    return databaseConnectionPromise
  }

  databaseConnectionPromise = createConnection({
    name: config.environment,
    type: 'postgres',
    host: database.host,
    port: Number.parseInt(database.port!),
    username: database.user,
    password: database.password,
    database: database.db,
    entities: [`${config.src}/models/**/*.{ts,js}`],
    synchronize: true,
    dropSchema: true,
    logging: false
  })

  return databaseConnectionPromise
}

export default setupConnection
