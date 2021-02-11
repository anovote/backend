import { EntityRepository, Repository } from 'typeorm'
import { ElectionOrganizer } from './ElectionOrganizerEntity'
import { IElectionOrganizer } from './IElectionOrganizer'

@EntityRepository(ElectionOrganizer)
export class ElectionOrganizerRepository extends Repository<ElectionOrganizer> {
  createElectionOrganizer(iElectionOrganizer: IElectionOrganizer): ElectionOrganizer {
    const electionOrganizer = new ElectionOrganizer()

    electionOrganizer.firstName = iElectionOrganizer.firstName
    electionOrganizer.lastName = iElectionOrganizer.lastName
    electionOrganizer.password = iElectionOrganizer.password
    electionOrganizer.email = iElectionOrganizer.email

    return electionOrganizer
  }
}
