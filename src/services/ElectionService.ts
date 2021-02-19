import { Election } from '@/models/Election/ElectionEntity'
import { Connection, getManager, Repository } from 'typeorm'
import { IElection } from '@/models/Election/IElection'
import { EncryptionService } from './EncryptionService'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'

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
    return await this.manager.findOne(id)
  }

  async createElection(electionDTO: IElection): Promise<Election | undefined> {
    if (electionDTO.password) {
      await this.hashEntityPassword(electionDTO)
    }

    if (await this.isDuplicate(electionDTO)) {
      throw new BadRequestError({ message: 'Election already exists' })
    }

    const election = this.manager.create(electionDTO)
    await validateEntity(election)
    election.id = -1

    return await this.manager.save(election)
  }

  private async hashEntityPassword(electionDTO: IElection) {
    const unhashedPassword = electionDTO.password
    const hashedPassword = await this.encryptionService.hash(unhashedPassword)
    electionDTO.password = hashedPassword
  }

  async updateElectionById(id: number, electionDTO: IElection): Promise<Election | undefined> {
    const election = this.manager.create(electionDTO)
    await validateEntity(election)
    election.id = id
    return await this.manager.save(election)
  }

  async deleteElectionById(id: number): Promise<Election | undefined> {
    const election = await this.manager.findOne(id)
    if (!election) {
      throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })
    }
    return await this.manager.remove(election)
  }

  async isDuplicate(election: IElection): Promise<boolean> {
    const { title, description, image, openDate, closeDate, password, status, isLocked, isAutomatic } = election
    const duplicate = await this.manager.find({
      where: {
        title,
        description,
        image,
        openDate,
        closeDate,
        password,
        status,
        isLocked,
        isAutomatic
      }
    })
    return duplicate.length > 0
  }
}
