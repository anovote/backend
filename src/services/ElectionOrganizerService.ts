import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'
import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'
import { validate } from 'class-validator'
import { getCustomRepository } from 'typeorm'
import { AuthenticationService } from './AuthenticationService'
import { EncryptionService } from './EncryptionService'

export class ElectionOrganizerService {
  /**
   * Creates an election organizer entity from a given election organizer model
   * @param iElectionOrganizer
   */
  create(iElectionOrganizer: IElectionOrganizer): ElectionOrganizer {
    return getCustomRepository(ElectionOrganizerRepository).createElectionOrganizer(iElectionOrganizer)
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
  private async isElectionOrganizerValid(electionOrganizer: ElectionOrganizer): Promise<boolean> {
    const errors = await validate(electionOrganizer)

    if (errors.length > 0) {
      return false
    } else {
      return true
    }
  }

  async createAndSaveElectionOrganizer(iElectionOrganizer: IElectionOrganizer): Promise<string> {
    const encryptionService = new EncryptionService()
    const authService = new AuthenticationService()
    let token
    const electionOrganizer = this.create(iElectionOrganizer)

    if (!(await this.isElectionOrganizerValid(electionOrganizer))) {
      throw new RangeError('Validation failed')
    }

    electionOrganizer.password = await encryptionService.hash(electionOrganizer.password)
    const id = await this.save(electionOrganizer)
    token = await authService.generateTokenFromId(id)
    return token
  }
}
