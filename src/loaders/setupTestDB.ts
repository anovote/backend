import config from '@/config'
import { Connection, createConnection } from 'typeorm'

let databaseConnectionPromise: Promise<Connection>

async function setupConnection() {
  if (databaseConnectionPromise) {
    console.log('here')

    return databaseConnectionPromise
  }

  console.log('or here')

  databaseConnectionPromise = createConnection({
    name: 'test',
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: config.database.user,
    password: config.database.password,
    database: 'TestDB',
    entities: [`${config.src}/models/**/*.{ts,js}`],
    synchronize: true,
    dropSchema: true,
    logging: false
  })

  return databaseConnectionPromise
}

export default setupConnection
