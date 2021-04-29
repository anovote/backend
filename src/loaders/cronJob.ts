import { ElectionService } from '@/services/ElectionService'
import Cron from 'node-cron'
import { Connection } from 'typeorm'
import { logger } from './logger'

/**
 * Initializes the cron worker
 */
const cronWorkerLoader = (database: Connection) => {
    Cron.schedule('* * * * *', async () => {
        logger.info('🧹 | check date and status for elections')

        let cronUpdatedCount = 0
        const electionService = new ElectionService(database)

        const electionsStarted = await electionService.startAllElectionsWhithOpenDateNotStarted()
        cronUpdatedCount += electionsStarted.affected!

        const electionsClosed = await electionService.closeAllElectionsWithCloseDateStarted()
        cronUpdatedCount += electionsClosed.affected!

        if (cronUpdatedCount > 0) {
            logger.info(`--- updated status for ${cronUpdatedCount} elections`)
        }
        cronUpdatedCount = 0
    })
}
export default cronWorkerLoader
