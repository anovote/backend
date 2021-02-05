import { ElectionStatus } from '@/models/Election'
import { Election } from '@/models/entity/Election'
import { ElectionOrganizer } from '@/models/entity/ElectionOrganizer'
import { Connection } from 'typeorm'

/**
 * FOR DEMONSTRATION >
 */
export interface ElectionBody {
  title: string
  description: string
}

/**
 * Responsible for handling elections
 */
export class ElectionService {
  private _db: Connection

  constructor(db: Connection) {
    this._db = db
  }
  /**
   * Creates a new election, and insert it into the database if it is valid.
   * If it is not, errors will fly :D
   * @param election election data
   */
  create(election: ElectionBody) {
    const eOrg = new ElectionOrganizer()
    eOrg.firstName = 'Hjalmar'
    eOrg.lastName = 'Andersen'
    eOrg.email = 'hjallis@gmail.com'
    eOrg.password = 'test123'

    const newElection = new Election()
    newElection.title = 'MY Nth ELECTION'
    newElection.description = 'ELECTIONS ARE BEST'
    newElection.status = ElectionStatus.NotStarted
    newElection.electionOrganizer = eOrg
    this._db.getRepository(Election).save(newElection)
  }
}
