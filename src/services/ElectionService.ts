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

  async getElectionById(id: number): Promise<Election | undefined> {
    return await this.manager.findOneOrFail(id)
  }

  async createElection(electionDTO: IElection): Promise<Election | undefined> {
    try {
      const result = await this.manager.insert(electionDTO)
      const id = result.identifiers[0].id

      const el = this.manager.findOne(id)

      return el
    } catch (error) {
      console.error(error)
    }
  }

  async updateElectionById(id: number, electionDTO: IElection): Promise<Election | undefined> {
    const updatedElection = await this.manager.update(id, electionDTO)

    return await this.manager.findOne(id)
  }

  async deleteElectionById(id: number): Promise<Election> {
    const election = await this.manager.findOneOrFail(id)
    await this.manager.delete(id)
    return election
  }
}
