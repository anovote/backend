import { ElectionService } from '@/services/ElectionService'
import chalk from 'chalk'
import Cron from 'node-cron'
import { Connection } from 'typeorm'
import { logger } from './logger'

/**
 * Initializes the cron worker
 */
const cronWorkerLoader = (database: Connection) => {
    Cron.schedule('* * * * *', async () => {
        let cronUpdatedCount = 0
        const electionService = new ElectionService(database)

        const electionsStarted = await electionService.startAllElectionsWhithOpenDateNotStarted()
        cronUpdatedCount += electionsStarted.affected!

        const electionsClosed = await electionService.closeAllElectionsWithCloseDateStarted()
        cronUpdatedCount += electionsClosed.affected!

        if (cronUpdatedCount > 0) {
            logger.info('🧹 | checked date and status for elections')
            logger.info(`--- updated status for ${chalk.yellow(cronUpdatedCount)} elections`)
            logger.info(`--- ${chalk.green(electionsStarted.affected)} elections were started`)
            logger.info(`--- ${chalk.red(electionsClosed.affected)} elections were closed`)
        }
        cronUpdatedCount = 0
    })
}
export default cronWorkerLoader
