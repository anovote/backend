import { strip } from '@/helpers/sanitize'
import { validateEntity } from '@/helpers/validateEntity'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { Connection, Repository } from 'typeorm'
import { ElectionService } from './ElectionService'

/**
 * Responsible for providing services for handling ballots.
 * It provides methods for creating, updating, deleting and getting ballot(s)
 */
export class BallotService {
  private _database: Connection
  private _ballotRepository: Repository<Ballot>
  private _electionService: ElectionService

  constructor(database: Connection, electionService: ElectionService) {
    this._database = database
    this._ballotRepository = this._database.getRepository(Ballot)
    this._electionService = electionService
  }

  /**
   * Creates a new ballot and return the created ballot entity.
   * Throws error if database, or query fails
   * @param newBallot the ballot to create
   */
  async create(newBallot: IBallot): Promise<Ballot | undefined> {
    const election = await this._electionService.getElectionById(newBallot.election)
    if (!election) throw new NotFoundError({ message: ServerErrorMessage.notFound('Election') })

    const ballotEntity = this._ballotRepository.create(newBallot)
    ballotEntity.id = -1
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
  async update(id: number, updatedBallot: IBallot) {
    const existingBallot = await this._ballotRepository.findOne({ id })
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
    return await this._ballotRepository.remove(existingBallot)
  }
  /**
   * Tries to get a ballot with the given ID, if the ballot exists return it,
   * else return undefined.
   * Throws error if database, or query fails
   * @param id the id of the ballot to get
   */
  async get(id: number) {
    return await this._ballotRepository.findOne({ id })
  }
}
