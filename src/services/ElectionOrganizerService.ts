import { validateEntity } from '@/helpers/validateEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'
import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'
import { getCustomRepository } from 'typeorm'
import { AuthenticationService } from './AuthenticationService'
import { EncryptionService } from './EncryptionService'

export class ElectionOrganizerService {
  /**
   * Creates an election organizer entity from a given election organizer model
   * @param electionOrganizer
   */
  create(electionOrganizer: IElectionOrganizer): ElectionOrganizer {
    return getCustomRepository(ElectionOrganizerRepository).createElectionOrganizer(electionOrganizer)
  }

  /**
   * Saves an given election organizer to the database and returns the id of it.
   * @param electionOrganizer the election organizer we want to save
   */
  async save(electionOrganizer: ElectionOrganizer): Promise<number> {
    const save = await getCustomRepository(ElectionOrganizerRepository).save(electionOrganizer)
    return save.id
  }

  async createAndSaveElectionOrganizer(electionOrganizer: IElectionOrganizer): Promise<string> {
    const encryptionService = new EncryptionService()
    const authService = new AuthenticationService()
    const organizer = this.create(electionOrganizer)

    await validateEntity(organizer)

    electionOrganizer.password = await encryptionService.hash(electionOrganizer.password)
    const id = await this.save(organizer)
    return await authService.generateTokenFromId(id)
  }
}
