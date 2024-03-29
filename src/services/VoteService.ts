import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { VoteValidator } from '@/lib/voting/VoteValidator'
import { IVote } from '@/models/Vote/IVote'
import { Vote } from '@/models/Vote/VoteEntity'
import { VoteRepository } from '@/models/Vote/VoteRepository'
import { Connection } from 'typeorm'
import BaseEntityService from './BaseEntityService'

export class VoteService extends BaseEntityService<Vote> {
    private _database: Connection
    private _voteRepository: VoteRepository

    constructor(db: Connection) {
        super(db, Vote)
        this._database = db
        this._voteRepository = this._database.getCustomRepository(VoteRepository)
    }

    get(): Promise<Vote[] | undefined> {
        throw new NotFoundError({ message: 'Not found' })
    }

    /**
     * Gets vote by id the vote ID
     * @param id of the vote to be found
     * @returns a vote with id or undefined
     */
    getById(id: number): Promise<Vote | undefined> {
        return this.getVoteById(id)
    }

    async getByBallotId(ballotId: number) {
        return await this._voteRepository.find({ where: { ballot: ballotId } })
    }

    async create(dto: IVote): Promise<Vote | undefined> {
        return await this.createAndSaveVote(dto)
    }

    private async createAndSaveVote(vote: IVote): Promise<Vote | undefined> {
        const voteValidator = new VoteValidator(this._database)

        await voteValidator.validateVote(vote)

        const voteCreated = this._voteRepository.createVote(vote)

        return await this._voteRepository.save(voteCreated)
    }

    private async getVoteById(id: number): Promise<Vote> {
        const vote: Vote | undefined = await this._voteRepository.findOne(id)

        if (!vote) throw new NotFoundError({ message: ServerErrorMessage.notFound('Vote') })

        return vote
    }

    delete(_id: number): Promise<void> {
        return Promise.reject(new NotFoundError({ message: 'Method not implemented' }))
    }

    update(_id: number, _dto: Vote | undefined): Promise<Vote | undefined> {
        return Promise.reject(new NotFoundError({ message: 'Method not implemented' }))
    }
}
