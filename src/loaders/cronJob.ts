import { ElectionService } from '@/services/ElectionService'
import Cron from 'node-cron'
import { Connection } from 'typeorm'
import { logger } from './logger'

/**
 * Initializes the cron worker
 */
const cronWorkerLoader = (database: Connection) => {
    Cron.schedule('* * * * *', async () => {
        logger.info('🧹 | updating status for elections')

        let cronUpdatedCount = 0
        const electionService = new ElectionService(database)

        const electionsShouldBeStarted = await electionService.getAllElectionsThatShouldBeStarted()

        for (const election of electionsShouldBeStarted) {
            await electionService.beginElection(election)
            cronUpdatedCount++
        }

        const electionsShouldBeClosed = await electionService.getAllElectionsThatShouldBeClosed()

        for (const election of electionsShouldBeClosed) {
            await electionService.markElectionClosed(election, false)
            cronUpdatedCount++
        }

        logger.info(`--- updated status for ${cronUpdatedCount} elections`)
        cronUpdatedCount = 0
    })
}
export default cronWorkerLoader
