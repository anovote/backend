import config from '@/config'
import { Connection, createConnection } from 'typeorm'

let databaseConnectionPromise: Promise<Connection>
const { database } = config
/**
 * Singleton database connection
 */
async function setupConnection(): Promise<Connection> {
  if (databaseConnectionPromise) {
    return await databaseConnectionPromise
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
