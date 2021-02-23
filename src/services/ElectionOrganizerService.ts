import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
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

  /**
   * Updates the password of a election organizer
   * @param newPassword The password we want to change to
   * @param id The id of the election organizer who is changing its password
   */
  async updatePassword(newPassword: string, id: number) {
    const encryptionService = new EncryptionService()
    const repository = getCustomRepository(ElectionOrganizerRepository)

    const electionOrganizer: ElectionOrganizer | undefined = await repository.findOne({
      id: id
    })

    if (!electionOrganizer) {
      throw new NotFoundError({ message: 'Did not find the election organizer' })
    }

    electionOrganizer.password = await encryptionService.hash(newPassword)
    const updatedElectionOrganizer = await repository.save(electionOrganizer)
    return updatedElectionOrganizer
  }

  /**
   * Returns the election organizer with the specified id.
   * Throws an RangeError if the election organizer is not found
   * @param id The id of the election organizer
   */
  async getElectionOrganizerById(id: number): Promise<ElectionOrganizer> {
    const repository = getCustomRepository(ElectionOrganizerRepository)

    const electionOrganizer: ElectionOrganizer | undefined = await repository.findOne({ id })

    if (!electionOrganizer) {
      throw new NotFoundError({ message: 'Did not find the election organizer' })
    }

    return electionOrganizer
  }
}
