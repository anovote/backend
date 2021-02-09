import { ElectionOrganizer } from '@/models/ElectionOrganizer'
import { ElectionOrganizerModel } from '@/models/ElectionOrganizer/ElectionOrganizerModel'
import { ElectionOrganizerRepository } from '@/models/ElectionOrganizer/ElectionOrganizerRepository'
import { validate } from 'class-validator'
import { getCustomRepository, getRepository } from 'typeorm'

export class ElectionOrganizerService {
  create(electionOrganizerModel: ElectionOrganizerModel): ElectionOrganizer {
    return getCustomRepository(ElectionOrganizerRepository).createElectionOrganizer(electionOrganizerModel)
  }

  async save(electionOrganizer: ElectionOrganizer): Promise<number> {
    const save = await getCustomRepository(ElectionOrganizerRepository).save(electionOrganizer)
    return save.id
  }

  async isElectionOrganizerValid(electionOrganizer: ElectionOrganizer): Promise<boolean> {
    const errors = await validate(electionOrganizer)
    if (errors.length > 0) {
      return false
    } else {
      return true
    }
  }
}
