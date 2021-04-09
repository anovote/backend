import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { ElectionStatsService } from '@/services/ElectionStats'
import { Router } from 'express'

const router = Router({ mergeParams: true })

router.get('/', async (request, response) => {
    const { electionId } = request.params
    try {
        const stats = await new ElectionStatsService(database, request.electionOrganizer).getElectionStats(
            Number.parseInt(electionId)
        )
        return response.send(stats)
    } catch (err) {
        logger.log('error', err.messages)
    }
})

export default router
