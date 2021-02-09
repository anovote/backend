import { EntityRepository, AbstractRepository, Repository } from 'typeorm'
import { ElectionOrganizer } from '.'
import { ElectionOrganizerModel } from './ElectionOrganizerModel'

@EntityRepository(ElectionOrganizer)
export class ElectionOrganizerRepository extends Repository<ElectionOrganizer> {
  createElectionOrganizer(electionOrganizerModel: ElectionOrganizerModel): ElectionOrganizer {
    const electionOrganizer = new ElectionOrganizer()

    electionOrganizer.firstName = electionOrganizerModel.firstName
    electionOrganizer.lastName = electionOrganizerModel.lastName
    electionOrganizer.password = electionOrganizerModel.password
    electionOrganizer.email = electionOrganizerModel.email

    return electionOrganizer
  }
}
