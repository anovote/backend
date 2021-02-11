import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { Connection, Repository } from 'typeorm'
import { ElectionService } from './ElectionService'

/**
 * Responsible for providng services for handling ballots.
 * It provides methods for creating, updating, deleting and getting ballot(s)
 */
export class BallotService {
  private _database: Connection
  private _ballotRepository: Repository<Ballot>
  private _electionService?: ElectionService

  constructor(database: Connection, electionService?: ElectionService) {
    this._database = database
    this._ballotRepository = this._database.getRepository(Ballot)
    this._electionService = electionService
  }

  /**
   * Creates a new ballot and return the created ballot entity.
   * Throws error if database, or query fails
   * @param newBallot the ballot to create
   */
  async create(newBallot: IBallot) {
    try {
      if (this._electionService) {
        const election = await this._electionService.getElectionById(newBallot.election)
        if (!election) return
        const ballotEntiy = this._ballotRepository.create(newBallot)
        ballotEntiy.id = -1
        return await this._ballotRepository.save(ballotEntiy)
      }
      return
    } catch (error) {
      logger.error(error)
      throw new Error('Unable to create ballot')
    }
  }

  /**
   * Updates the provided ballot with the given id. If it is found and updated, it returns
   * the updated entity. Else it return undefined.
   * Throws error if database, or query fails
   * @param id the id of the ballot to update
   * @param updatedBallot the updated ballot details
   */
  async update(id: number, updatedBallot: IBallot) {
    try {
      const existingBallot = await this._ballotRepository.findOne({ id })
      if (!existingBallot) return
      // Todo; make better implementation of this (makes sure it cant be updated by user).
      delete (updatedBallot as any)['createdAt']
      delete (updatedBallot as any)['updatedAt']
      return await this._ballotRepository.update(id, updatedBallot)
    } catch (error) {
      logger.error(error)
      throw new Error('Failed to update ballot')
    }
  }
  /**
   * Deletes a ballot by the given ID, if it exists,
   * the ballot is returned, else undefined.
   * Throws error if database, or query fails
   * @param id the id of the ballot to delete
   */
  async delete(id: number) {
    try {
      const existingBallot = await this._ballotRepository.findOne(id)
      if (!existingBallot) return
      return await this._ballotRepository.remove(existingBallot)
    } catch (error) {
      logger.error(error)
      throw new Error('Failed to delete ballot')
    }
  }
  /**
   * Tries to get a ballot with the given ID, if the ballot exists return it,
   * else return undefined.
   * Throws error if database, or query fails
   * @param id the id of the ballot to get
   */
  async get(id: number) {
    try {
      return await this._ballotRepository.findOne({ id })
    } catch (error) {
      logger.error(error)
      throw new Error('Failed to get ballot')
    }
  }
}
