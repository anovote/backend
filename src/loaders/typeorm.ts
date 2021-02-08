import 'reflect-metadata'
import { createConnection } from 'typeorm'
import config from '@/config'

/**
 * Responsible for initializing TypeORM
 */
export default async () => {
  /**
   * Figure out this type
   */
  const typeormConfig: any = {
    type: 'postgres',
    host: config.database.host,
    port: Number.parseInt(config.database.port!),
    username: config.database.user,
    password: config.database.password,
    database: config.database.db,
    synchronize: true,
    logging: false,
    entities: ['src/models/**/*.ts'],
    migrations: ['src/models/migration/**/*.ts'],
    subscribers: ['src/models/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/models/',
      migrationsDir: 'src/models/migration',
      subscribersDir: 'src/models/subscriber'
    }
  }

  const connection = await createConnection(typeormConfig)
  return connection
}
