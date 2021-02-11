import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { IBallot } from '@/models/Ballot/IBallot'
import { Connection, QueryFailedError, Repository } from 'typeorm'

export class BallotService {
  private _database: Connection
  private _ballotRepository: Repository<Ballot>

  constructor(database: Connection) {
    this._database = database
    this._ballotRepository = this._database.getRepository(Ballot)
  }

  async create(newBallot: IBallot) {
    try {
      
      const ballotEntiy = this._ballotRepository.create(newBallot)
      await this._ballotRepository.save(ballotEntiy)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        logger.error(error)
      }
    }
  }

  async update() {
    try {
    } catch (error) {}
  }

  async delete() {
    try {
    } catch (error) {}
  }

  async get() {
    try {
    } catch (error) {}
  }
}
