import { Election } from '@/models/Election'
import { ElectionStatus } from '@/models/Election/enums'
import { ElectionOrganizer } from '@/models/ElectionOrganizer'
import { EncryptionService } from '@/services/EncryptionService'
import { Connection } from 'typeorm'

export const createDummyElection = async (connection: Connection, organizer: ElectionOrganizer) => {
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
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleVoters: []
  })
  return await repository.save(election)
}

export const deleteDummyElections = async (connection: Connection, elections: Array<Election>) => {
  const repository = connection.getRepository(Election)
  await repository.remove(elections)
}
