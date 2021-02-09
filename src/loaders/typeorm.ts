import 'reflect-metadata'
import { createConnection } from 'typeorm'
import config from '@/config'
import { ElectionOrganizer } from '@/models/ElectionOrganizer'

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
    entities: [`${config.src}/models/**/*.{ts,js}`],
    migrations: [`${config.src}/models/migration/**/*.{ts,js}`],
    subscribers: [`${config.src}/models/subscriber/**/*.{ts,js}`],
    cli: {
      entitiesDir: `${config.src}/models`,
      migrationsDir: `${config.src}/models/migration`,
      subscribersDir: `${config.src}/models/subscriber`
    }
  }

  const connection = await createConnection(typeormConfig)
  return connection
}
