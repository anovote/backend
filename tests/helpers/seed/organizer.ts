import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { HashService } from '@/services/HashService'
import { Connection } from 'typeorm'

export const createDummyOrganizer = async (database: Connection): Promise<ElectionOrganizer> => {
    const repository = database.getRepository(ElectionOrganizer)
    const hashService = new HashService()

    const organizer = new ElectionOrganizer()
    organizer.email = 'email@anovote.com'
    organizer.firstName = 'ano'
    organizer.lastName = 'vote'
    organizer.password = await hashService.hash('123456')

    repository.create(organizer)
    return await repository.save(organizer)
}

export const deleteDummyOrganizer = async (
    database: Connection,
    electionOrganizer: ElectionOrganizer
): Promise<void> => {
    const repository = database.getRepository(ElectionOrganizer)
    await repository.remove(electionOrganizer)
}
