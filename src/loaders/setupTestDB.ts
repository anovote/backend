import config from '@/config'
import { Connection, createConnection } from 'typeorm'

let databaseConnectionPromise: Promise<Connection>

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
    host: process.env.DB_TEST_HOST,
    port: Number.parseInt(process.env.DB_TEST_PORT!),
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    entities: [`${config.src}/models/**/*.{ts,js}`],
    synchronize: true,
    dropSchema: true,
    logging: false
  })

  return databaseConnectionPromise
}

export default setupConnection
