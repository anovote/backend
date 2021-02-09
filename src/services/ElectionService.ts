import { ElectionStatus } from '@/models/election/ElectionStatus'
import { Election } from '@/models/Election'
import { ElectionOrganizer } from '@/models/ElectionOrganizer'
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
      if (error && error.name === 'QueryFailedError') {
        throw new Error('Query failed')
      }
    }
  }

  async updateElectionById(id: number, electionDTO: IElection): Promise<Election | undefined> {
    const updatedElection = await this.manager.update(id, electionDTO)

    return await this.manager.findOne(id)
  }

  async deleteElectionById(id: number): Promise<Election | undefined> {
    const election = await this.manager.findOne(id)
    if (!election) {
      throw new Error(`Entity with id: ${id} not found`)
    }
    await this.manager.remove(election)
    return election
  }

  async isDuplicate(election: IElection): Promise<boolean> {
    const { title, description, image, openDate, closeDate, password, status, isLocked, isAutomatic } = election
    const duplicate = await this.manager.find({
      where: {
        title,
        description,
        // image, openDate, closeDate,
        // password,
        status,
        isLocked,
        isAutomatic
      }
    })
    return duplicate.length > 0
}
