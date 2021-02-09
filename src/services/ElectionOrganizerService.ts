import { ElectionOrganizer } from '@/models/ElectionOrganizer'
import { ElectionOrganizerModel } from '@/models/ElectionOrganizer/ElectionOrganizerModel'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'
import { validate } from 'class-validator'
import { getCustomRepository, getRepository } from 'typeorm'
import { AuthenticationService } from './AuthenticationService'
import { EncryptionService } from './EncryptionService'

export class ElectionOrganizerService {
  /**
   * Creates an election organizer entity from a given election organizer model
   * @param electionOrganizerModel
   */
  create(electionOrganizerModel: ElectionOrganizerModel): ElectionOrganizer {
    return getCustomRepository(ElectionOrganizerRepository).createElectionOrganizer(electionOrganizerModel)
  }

  /**
   * Saves an given election organizer to the database and returns the id of it.
   * @param electionOrganizer the election organizer we want to save
   */
  async save(electionOrganizer: ElectionOrganizer): Promise<number> {
    const save = await getCustomRepository(ElectionOrganizerRepository).save(electionOrganizer)
    return save.id
  }

  /**
   * Validates if an election organizer is correct, returns true if it is, or false
   * if it is not
   * @param electionOrganizer the election organizer we want to validate.
   */
  async isElectionOrganizerValid(electionOrganizer: ElectionOrganizer): Promise<boolean> {
    const errors = await validate(electionOrganizer)
    if (errors.length > 0) {
      return false
    } else {
      return true
    }
  }

  async createAndSaveElectionOrganizer(electionOrganizerModel: ElectionOrganizerModel): Promise<string> {
    const encryptionService = new EncryptionService()
    const authService = new AuthenticationService()
    let token
    const electionOrganizer = this.create(electionOrganizerModel)
    if (await this.isElectionOrganizerValid(electionOrganizer)) {
      electionOrganizer.password = await encryptionService.hash(electionOrganizer.password)
      const id = await this.save(electionOrganizer)
      token = await authService.generateTokenFromId(id)
    } else {
      throw new RangeError('Validation failed')
    }
    return token
  }
}
