import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { Connection } from 'typeorm'
import { getTestDatabase } from '../helpers/database'

describe('election organizer service', () => {
  let db: Connection
  let service: ElectionOrganizerService
  let seedOrganizer: ElectionOrganizer
  const organizers: ElectionOrganizer[] = []

  const passwordPassedIn = '@passwordIsSecret1099'
  const rand = Math.random() * 10
  beforeAll(async () => {
    db = await getTestDatabase()
    service = new ElectionOrganizerService(db)
    seedOrganizer = await (service.createAndSaveElectionOrganizer({
      firstName: 'First organizer',
      lastName: 'Last name org',
      email: rand + 'testing@gmail.com',
      password: passwordPassedIn
    }) as Promise<ElectionOrganizer>)

    organizers.push(seedOrganizer)
  })

  afterAll(async () => {
    for (const organizer of organizers) {
      const org = await service.delete(organizer.id)
    }
    await db.close()
  })

  it('should create a election organizer', async () => {
    expect(seedOrganizer).toBeInstanceOf(ElectionOrganizer)
  })

  it('should generate a hash for the password', async () => {
    expect(seedOrganizer.password).not.toBe(passwordPassedIn)
  })
})
