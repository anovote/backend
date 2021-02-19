import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'
import { IElectionOrganizer } from '@/models/ElectionOrganizer/IElectionOrganizer'
import { Connection } from 'typeorm'
import { EncryptionService } from './EncryptionService'

export class ElectionOrganizerService {
  private _database: Connection
  private _organizerRepository: ElectionOrganizerRepository

  constructor(db: Connection) {
    this._database = db
    this._organizerRepository = this._database.getCustomRepository(ElectionOrganizerRepository)
  }

  /**
   * Creates an election organizer entity from a given election organizer model
   * @param electionOrganizer
   */

  create(electionOrganizer: IElectionOrganizer): ElectionOrganizer {
    return this._organizerRepository.createElectionOrganizer(electionOrganizer)
  }

  /**
   * Saves an given election organizer to the database and returns it
   * @param electionOrganizer the election organizer we want to save
   */
  async save(electionOrganizer: ElectionOrganizer): Promise<ElectionOrganizer> {
    const saved = await this._organizerRepository.save(electionOrganizer)
    return saved
  }

  async createAndSaveElectionOrganizer(electionOrganizer: IElectionOrganizer): Promise<ElectionOrganizer> {
    const encryptionService = new EncryptionService()

    const organizer = this.create(electionOrganizer)

    await validateEntity(organizer)
    organizer.password = await encryptionService.hash(organizer.password)

    return await this.save(organizer)
  }

  /**
   * Updates the password of a election organizer
   * @param newPassword The password we want to change to
   * @param id The id of the election organizer who is changing its password
   */
  async updatePassword(newPassword: string, id: number) {
    const encryptionService = new EncryptionService()
    const repository = this._organizerRepository

    const electionOrganizer: ElectionOrganizer | undefined = await repository.findOne({
      id
    })

    if (!electionOrganizer) {
      throw new RangeError('Did not find the election organizer')
    }

    electionOrganizer.password = await encryptionService.hash(newPassword)
    const updatedElectionOrganizer = await repository.save(electionOrganizer)
    return updatedElectionOrganizer
  }
  /**
   * Deletes a organizer by the given ID, if it exists,
   * Throws error if database, or query fails
   * @param id the id of the ballot to delete
   * @return the organizer or if it does not exist, undefined
   */
  async delete(id: number) {
    const existingOrganizer = await this._organizerRepository.findOne(id)
    if (!existingOrganizer) throw new NotFoundError({ message: ServerErrorMessage.notFound('Election Organizer') })
    return await this._organizerRepository.remove(existingOrganizer)
  }
}
