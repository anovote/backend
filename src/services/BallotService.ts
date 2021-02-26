import { strip } from '@/helpers/sanitize'
import { validateEntity } from '@/helpers/validateEntity'
import { IHasOwner } from '@/interfaces/IHasOwner'
import { ForbiddenError } from '@/lib/errors/http/ForbiddenError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { Connection, Repository } from 'typeorm'
import BaseEntityService, { CrudOptions } from './BaseEntityService'
import { ElectionService } from './ElectionService'

/**
 * Responsible for providing services for handling ballots.
 * It provides methods for creating, updating, deleting and getting ballot(s)
 */
export class BallotService extends BaseEntityService<Ballot> implements IHasOwner<Ballot> {
  private _database: Connection
  private _ballotRepository: Repository<Ballot>
  private _electionService: ElectionService
  owner: ElectionOrganizer

  constructor(database: Connection, electionService: ElectionService, owner: ElectionOrganizer) {
    super(database, Ballot)
    this.owner = owner
    this._database = database
    this._ballotRepository = this._database.getRepository(Ballot)
    this._electionService = electionService
  }

  get(): Promise<Ballot[] | undefined> {
    // const {election}
    // return this._ballotRepository.find({ where: { election: this._election } })
    throw new NotFoundError({ message: 'No ballots found' })
  }

  getByElection(election: Election) {
    return this._ballotRepository.find({ where: { election } })
  }

  create(dto: IBallot, { parentId: electionId }: CrudOptions): Promise<Ballot | undefined> {
    try {
      return this.createBallot(dto, electionId!)
    } catch (error) {
      throw error
    }
  }

  update(id: number, dto: Ballot): Promise<Ballot | undefined> {
    return this.updateBallot(id, dto)
  }

  /**
   * Creates a new ballot and return the created ballot entity.
   * Throws error if database, or query fails
   * @param newBallot the ballot to create
   */
  private async createBallot(newBallot: IBallot, electionId: number): Promise<Ballot | undefined> {
    const election = await this._electionService.getById(electionId)
    if (!election) throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })

    const ballotEntity = this._ballotRepository.create(newBallot)
    ballotEntity.id = -1

    ballotEntity.election = election
    await validateEntity(ballotEntity)

    return await this._ballotRepository.save(ballotEntity)
  }

  /**
   * Updates the provided ballot with the given id. If it is found and updated, it returns
   * the updated entity. Else it return undefined.
   * Throws error if database, or query fails
   * @param id the id of the ballot to update
   * @param updatedBallot the updated ballot details
   */
  private async updateBallot(id: number, updatedBallot: Ballot) {
    const existingBallot = await this._ballotRepository.findOne(id)
    if (!existingBallot) throw new NotFoundError({ message: ServerErrorMessage.notFound('Ballot') })

    const strippedBallot = strip(updatedBallot, ['id', 'createdAt', 'updatedAt'])
    const mergedBallot = Object.assign(existingBallot, strippedBallot)
    await validateEntity(mergedBallot)

    return await this._ballotRepository.save(mergedBallot)
  }

  /**
   * Deletes a ballot by the given ID, if it exists,
   * the ballot is returned, else undefined.
   * Throws error if database, or query fails
   * @param id the id of the ballot to delete
   */
  async delete(id: number) {
    const existingBallot = await this._ballotRepository.findOne(id)
    if (!existingBallot) throw new NotFoundError({ message: ServerErrorMessage.notFound('Ballot') })

    await this.verifyOwner(existingBallot)

    await this._ballotRepository.remove(existingBallot)
  }

  async verifyOwner(ballot: Ballot) {
    const election = await this._electionService.getById(ballot.election.id)
    if (!election || election.electionOrganizer !== this.owner) {
      throw new ForbiddenError()
    }
  }

  /**
   * Tries to get a ballot with the given ID, if the ballot exists return it,
   * else return undefined.
   * Throws error if database, or query fails
   * @param id the id of the ballot to get
   */
  async getById(id: number) {
    const ballot = await this._ballotRepository.findOne(id, { relations: ['election', 'election.electionOrganizer'] })
    if (!ballot) return undefined

    await this.verifyOwner(ballot!)
    return ballot
  }
}
