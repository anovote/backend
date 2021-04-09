import { database } from '@/loaders'
import { ElectionStatsService } from '@/services/ElectionStats'
import { Router } from 'express'

const router = Router({ mergeParams: true })

router.get('/', async (request, response) => {
    const { electionId } = request.params
    const stats = await new ElectionStatsService(database, request.electionOrganizer).getElectionStats(
        Number.parseInt(electionId)
    )
    return response.send(stats)
})

export default router
