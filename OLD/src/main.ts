/**
 * Just some example code to se if the orm database application is running
 */
import { ConnectionOptions, createConnection } from './deps.ts'
import { Election } from './entity/Election.ts'
import { ElectionOrganizer } from './entity/ElectionOrganizer.ts'
import { EligibleVoter } from './entity/EligibleVoter.ts'
import { config } from './deps.ts'
import { logger } from './logger.ts'

const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: Number.parseInt(config.get('DB_PORT')!),
  username: config.get('POSTGRES_USER'),
  password: config.get('POSTGRES_PASSWORD'),
  database: config.get('POSTGRES_DB'),
  entities: [Deno.cwd() + '/src/entity/**/*.ts'],
  synchronize: true
}

try {
  const connection = await createConnection(dbConfig)

  /** ADD SOME TEST DATA */

  console.log('Check your database: ', connection.isConnected)
} catch (e) {
  console.log(e)
}

logger.info('Hello sander again')
//logger.warn("Hello sander again");