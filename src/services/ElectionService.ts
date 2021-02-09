import { Election } from '@/models/Election'
import { Connection, getManager, Repository } from 'typeorm'
import { IElection } from '@/models/Election/IElection'
import { EncryptionService } from './EncryptionService'

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
  private manager: Repository<Election>
  private readonly encryptionService: EncryptionService

  constructor(db: Connection) {
    this.manager = getManager().getRepository(Election)
    this.encryptionService = new EncryptionService()
  }

  async getAllElections(): Promise<Election[] | undefined> {
    try {
      return await this.manager.find()
    } catch (err) {
      console.log(err)
    }
  }

  async getElectionById(id: number): Promise<Election | undefined> {
    return await this.manager.findOneOrFail(id)
  }

  async createElection(electionDTO: IElection): Promise<Election | undefined> {
    try {
      if (electionDTO.password) {
        await this.hashEntityPassword(electionDTO)
      }

      if (await this.isDuplicate(electionDTO)) {
        throw new Error('Entry is duplicate')
      }

      const election = this.manager.create(electionDTO)
      // election.id = -1

      return await this.manager.save(election)
    } catch (error) {
      console.log(error.message)

      if (error && error.name === 'QueryFailedError') {
        throw new Error('Query failed')
      }
    }
  }

  private async hashEntityPassword(electionDTO: IElection) {
    const unhashedPassword = electionDTO.password
    const hashedPassword = await this.encryptionService.hash(unhashedPassword)
    electionDTO.password = hashedPassword
  }

  async updateElectionById(id: number, electionDTO: IElection): Promise<Election | undefined> {
    const election = this.manager.create(electionDTO)
    election.id = id
    return await this.manager.save(election)
    // return await this.manager.findOne(id)
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
}
