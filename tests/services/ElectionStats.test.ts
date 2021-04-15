import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionStatsService } from '@/services/ElectionStats'
import { Connection } from 'typeorm'
import { createDummyOrganizer } from '../helpers/seed/organizer'
import setupConnection from '../helpers/setupTestDB'

let statService: ElectionStatsService
let database: Connection
let organizer: ElectionOrganizer

beforeAll(async () => {
    database = await setupConnection()
    organizer = await createDummyOrganizer(database)
    statService = new ElectionStatsService(database, organizer)
})

describe('getElection', () => {
    it('should throw error if no election is found', async () => {
        const electionId = 222
        await expect(statService.getElectionStats(electionId)).rejects.toThrow(NotFoundError)
    })
})
