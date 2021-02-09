import { EntityRepository, AbstractRepository, Repository } from 'typeorm'
import { ElectionOrganizer } from '.'
import { ElectionOrganizerModel } from './ElectionOrganizerModel'
import { validate } from 'class-validator'
import { EncryptionService } from '@/services/EncryptionService'

@EntityRepository(ElectionOrganizer)
export class ElectionOrganizerRepository extends Repository<ElectionOrganizer> {
  async createAndSave(electionOrganizerModel: ElectionOrganizerModel): Promise<number> {
    const encryptionService = new EncryptionService()
    const electionOrganizer = this.createElectionOrganizer(electionOrganizerModel)
    const errors = await validate(electionOrganizer)
    if (errors.length > 0) {
      throw new Error('Validation failed!')
    } else {
      electionOrganizer.password = await encryptionService.hash(electionOrganizer.password)
      const save = await this.manager.save(electionOrganizer)
      return save.id
    }
  }

  createElectionOrganizer(electionOrganizerModel: ElectionOrganizerModel): ElectionOrganizer {
    const electionOrganizer = new ElectionOrganizer()

    electionOrganizer.firstName = electionOrganizerModel.firstName
    electionOrganizer.lastName = electionOrganizerModel.lastName
    electionOrganizer.password = electionOrganizerModel.password
    electionOrganizer.email = electionOrganizerModel.email

    return electionOrganizer
  }
}
