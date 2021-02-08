import { ElectionStatus } from '@/models/election/ElectionStatus'
import { Election } from '@/models/election/Election'
import { ElectionOrganizer } from '@/models/entity/ElectionOrganizer'
import { Connection, EntityManager, getManager, Repository } from 'typeorm'
import { IElection } from '@/models/election/IElection'

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
  private manager: Repository<Election>

  constructor(db: Connection) {
    this._db = db
    this.manager = getManager().getRepository(Election)
  }

  async getAllElections(): Promise<Election[] | undefined> {
    try {
      return this.manager.find()
    } catch (err) {
      console.log(err)
    }
  }

  async createElection(electionDTO: IElection): Promise<Election | undefined> {
    try {
      const result = await this.manager.insert(electionDTO)
      const election = result.generatedMaps

      const el = new Election()

      return el
    } catch (error) {
      console.error(error)
    }
  }

  async updateElectionById(electionDTO: IElection) {
    const id = electionDTO.id
    const updatedElection = await this.manager.update(id, electionDTO)
    return updatedElection
  }

  async deleteElectionById(electionDTO: IElection): Promise<Election> {
    const id = electionDTO.id
    const election = this.manager.findOneOrFail(id)
    await this.manager.delete(id)
    return election
  }
}
