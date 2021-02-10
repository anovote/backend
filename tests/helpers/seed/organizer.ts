import { ElectionOrganizer } from '@/models/ElectionOrganizer'
import { EncryptionService } from '@/services/EncryptionService'
import { Connection } from 'typeorm'

export const createDummyOganizer = async (database: Connection): Promise<ElectionOrganizer> => {
  const repository = database.getRepository(ElectionOrganizer)
  const encryptionService = new EncryptionService()

  const organizer = new ElectionOrganizer()
  organizer.email = 'email@anovote.com'
  organizer.firstName = 'ano'
  organizer.lastName = 'vote'
  organizer.password = await encryptionService.hash('123456')

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
