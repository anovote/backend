import { Election } from '@/models/Election/ElectionEntity'
import { ElectionStatus } from '@/models/Election/ElectionStatus'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { EncryptionService } from '@/services/EncryptionService'
import { Connection } from 'typeorm'

export const createDummyElection = async (connection: Connection, organizer: ElectionOrganizer): Promise<Election> => {
  const repository = connection.getRepository(Election)
  const encryptionService = new EncryptionService()

  const election = repository.create({
    title: 'Election 2000',
    password: await encryptionService.hash('123456'),
    status: ElectionStatus.NotStarted,
    electionOrganizer: organizer,
    description: 'Some random description',
    image: 'img.png',
    openDate: new Date(),
    closeDate: new Date(),
    isLocked: true,
    isAutomatic: false,
    eligibleVoters: []
  })
  return await repository.save(election)
}

export const deleteDummyElections = async (connection: Connection, elections: Array<Election>): Promise<void> => {
  const repository = connection.getRepository(Election)
  await repository.remove(elections)
}
