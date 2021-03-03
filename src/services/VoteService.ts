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

    create(dto: Vote): Promise<Vote | undefined> {
        return this.createAndSaveVote(dto)
    }

    createVote(vote: IVote): Vote {
        return this._voteRepository.createVote(vote)
    }

    async save(vote: Vote): Promise<Vote> {
        const saved = await this._voteRepository.save(vote)
        return saved
    }

    async createAndSaveVote(vote: IVote): Promise<Vote> {
        const voteCreated = this.createVote(vote)

        return await this.save(voteCreated)
    }

    async getVoteById(id: number): Promise<Vote> {
        const vote: Vote | undefined = await this._voteRepository.findOne(id)

        if (!vote) throw new NotFoundError({ message: ServerErrorMessage.notFound('Vote') })

        return vote
    }

    async delete(id: number) {
        await this
        throw new NotFoundError({ message: 'Method not impemented' })
    }

    async update(id: number, dto: Vote): Promise<Vote | undefined> {
        await this
        throw new NotFoundError({ message: 'Method not impemented' })
    }
}
