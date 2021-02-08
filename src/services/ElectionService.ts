import { ElectionStatus } from '@/models/IElection'
import { Election } from '@/models/entity/Election'
import { ElectionOrganizer } from '@/models/entity/ElectionOrganizer'
import { Connection, EntityManager, getManager } from 'typeorm'

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
  private manager: EntityManager

  constructor(db: Connection) {
    this._db = db
    this.manager = getManager()
  }

  async getAllElections(): Promise<Election[] | undefined> {
    try {
      return getManager().find(Election)
    } catch (err) {
      console.log(err)
    }
  }

  async createElection(electionDTO: Election): Promise<Election> {
    try {
      const manager = getManager()
      return manager.insert(Election, electionDTO)
    } catch (error) {
      console.error(error)
    }
  }

  async updateElectionById(electionDTO: Election) {
    const id = electionDTO.id
    const updatedElection = await getManager().update(Election, id, electionDTO)
    return updatedElection
  }

  async deleteElectionById(electionDTO: Election): Promise<Election> {
    return getManager().remove(electionDTO)
  }
}
