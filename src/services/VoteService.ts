import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
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

    getById(id: number): Promise<Vote | undefined> {
        return this.getVoteById(id)
    }

    async create(dto: IVote): Promise<Vote | undefined> {
        return await this.createAndSaveVote(dto)
    }

    private createVote(vote: IVote): Vote {
        return this._voteRepository.createVote(vote)
    }

    // TODO, add implementation to check if a vote is submitted
    // between open and close date of its election
    // TODO, check if the election has moved on to a different ballot
    // TODO, check if the election status, to see if it has ended
    private async createAndSaveVote(vote: IVote): Promise<Vote> {
        const exists = await this._voteRepository.findOne({ voterId: vote.voterId, candidate: vote.candidate })

        if (exists != undefined) {
            throw new Error('I already exist')
        }

        const voteCreated = this.createVote(vote)

        return await this._voteRepository.save(voteCreated)
    }

    private async getVoteById(id: number): Promise<Vote> {
        const vote: Vote | undefined = await this._voteRepository.findOne(id)

        if (!vote) throw new NotFoundError({ message: ServerErrorMessage.notFound('Vote') })

        return vote
    }

    async delete(_id: number): Promise<void> {
        await this
        throw new NotFoundError({ message: 'Method not implemented' })
    }

    async update(_id: number, _dto: Vote | undefined): Promise<Vote | undefined> {
        await this
        throw new NotFoundError({ message: 'Method not implemented' })
    }
}