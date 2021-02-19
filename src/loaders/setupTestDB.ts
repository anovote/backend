import config from '@/config'
import { createConnection } from 'typeorm'

async function setupConnection() {
  return await createConnection({
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
}

export default setupConnection
