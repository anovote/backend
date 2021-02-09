import { EntityRepository, AbstractRepository } from 'typeorm'
import { ElectionOrganizer } from '@/models/ElectionOrganizer'
import { ElectionOrganizerModel } from './ElectionOrganizerModel'
import { validate } from 'class-validator'
import { EncryptionService } from '@/services/EncryptionService'

@EntityRepository(ElectionOrganizer)
export class ElectionOrganizerRepository extends AbstractRepository<ElectionOrganizer> {
  async createAndSave(electionOrganizerModel: ElectionOrganizerModel): Promise<number> {
    const encryptionService = new EncryptionService()

    const electionOrganizer = new ElectionOrganizer()
    electionOrganizer.firstName = electionOrganizerModel.firstName
    electionOrganizer.lastName = electionOrganizerModel.lastName
    electionOrganizer.password = electionOrganizerModel.password
    electionOrganizer.email = electionOrganizerModel.email

    const errors = await validate(electionOrganizer)
    if (errors.length > 0) {
      throw new Error('Validation failed!')
    } else {
      electionOrganizer.password = await encryptionService.hash(electionOrganizer.password)
      const save = await this.manager.save(electionOrganizer)
      return save.id
    }
  }

  findOneByEmail(email: string) {
    return this.repository.findOne(email)
  }
}
