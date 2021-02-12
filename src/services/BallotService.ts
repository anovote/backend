import { CreateError } from '@/lib/Errors/CreateError'
import { NotFoundError } from '@/lib/Errors/NotFoundError'
import { UpdateError } from '@/lib/Errors/UpdateError'
import { ValidationError } from '@/lib/Errors/ValidationError'
import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { validate } from 'class-validator'
import { Connection, Repository } from 'typeorm'
import { error } from 'winston'
import { ElectionService } from './ElectionService'

/**
 * Responsible for providng services for handling ballots.
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
    try {
      const election = await this._electionService.getElectionById(newBallot.election)
      if (!election) throw new NotFoundError(`Election with id ${newBallot.election} doesnt exist for ballot`)
      const ballotEntiy = this._ballotRepository.create(newBallot)
      ballotEntiy.id = -1
      const validation = await this.validateBallot(ballotEntiy)
      if (!validation.isValid) throw new ValidationError('Failed to create new ballot, failed validation')
      return await this._ballotRepository.save(ballotEntiy)
    } catch (error) {
      logger.error(error)
      if (error instanceof NotFoundError) throw error
      if (error instanceof ValidationError) throw new CreateError('Unable to create ballot')
      throw new Error('Unexpected error')
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
      if (!existingBallot) throw new NotFoundError(`Ballot with id ${id} does not exist`)
      // Todo; make better implementation of this (makes sure it cant be updated by user).
      delete (updatedBallot as any)['createdAt']
      delete (updatedBallot as any)['updatedAt']
      const mergedBallot = Object.assign(existingBallot, updatedBallot)
      const validation = await this.validateBallot(mergedBallot)
      if (!validation.isValid) throw new ValidationError('Failed to create new ballot, failed validation')
      return await this._ballotRepository.save(mergedBallot)
    } catch (error) {
      logger.error(error)
      if (error instanceof NotFoundError) throw error
      if (error instanceof ValidationError) throw new UpdateError('Unable to create ballot')
      throw new Error('Unexpected error')
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
      if (!existingBallot) throw new NotFoundError(`Ballot with id ${id} does not exist`)
      return await this._ballotRepository.remove(existingBallot)
    } catch (error) {
      logger.error(error)
      if (error instanceof NotFoundError) throw error
      throw new Error('Unexpected error')
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
      throw new Error('Unexpected error')
    }
  }

  private async validateBallot(ballot: Ballot) {
    const validation = await validate(ballot)
    const isValid = validation.length === 0
    const messages = []
    for (const validationMessage of validation) {
      for (const key in validationMessage.constraints) {
        if (Object.prototype.hasOwnProperty.call(validationMessage.constraints, key)) {
          const message: string = (validationMessage.constraints as any)[key]
          messages.push(message)
        }
      }
    }

    return { isValid, messages }
  }
}
