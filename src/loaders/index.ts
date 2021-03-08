/**
 * Entry loader
 *
 * Responsible for loading all modules which must be initialized
 * for application to work.
 */
import { Application } from 'express'

import expressLoader from '@/loaders/express'
import websocketLoader from '@/loaders/websocket'
import typeormLoader from '@/loaders/typeorm'
import config from '@/config'
import { logger } from '@/loaders/logger'
import { Connection } from 'typeorm/connection/Connection'

let database!: Connection

let loaded = false
export const load = async ({ server }: { server: Application }) => {
    if (loaded) throw new Error('Application already loaded...')
    logger.info(`env > ${config.environment}\n`)

    logger.info('-- loading express 🧬')
    const loadedExpress = await expressLoader({ server })
    logger.info('------- express loaded ✅\n')

    logger.info('-- loading typeORM 🧬')
    const loadedTypeOrm = await typeormLoader()
    logger.info('------ typeORM loaded ✅')

    database = loadedTypeOrm

    logger.info('-- loading websocket')
    const websocket = websocketLoader(loadedExpress)
    logger.info('------- websocket loaded ✅')
    logger.info(`------- websocket listening on: ${process.env.WS_PORT} \n`)

    loaded = true

    return { loadedExpress, loadedTypeOrm }
}

export { database }
