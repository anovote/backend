import config from '@/config'
import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'

/**
 * Responsible for initializing TypeORM
 */
export default async () => {
    const typeormConfig: ConnectionOptions = {
        type: 'postgres',
        host: config.database.host,
        port: Number.parseInt(config.database.port!),
        username: config.database.user,
        password: config.database.password,
        database: config.database.db,
        dropSchema: config.database.dropSchema,
        synchronize: true,
        logging: ['error'],
        logger: 'advanced-console',
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
