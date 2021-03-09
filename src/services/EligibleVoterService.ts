import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { Connection, Repository } from 'typeorm'
import BaseEntityService from './BaseEntityService'

export class EligibleVoterService extends BaseEntityService<EligibleVoter> {
    private _db: Connection
    private _repo: Repository<EligibleVoter>

    constructor(db: Connection) {
        super(db, EligibleVoter)
        this._db = db
        this._repo = this._db.getRepository(EligibleVoter)
    }

    get(): Promise<EligibleVoter[] | undefined> {
        throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
    }

    getById(id: number): Promise<EligibleVoter | undefined> {
        throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
    }

    create(dto: EligibleVoter): Promise<EligibleVoter | undefined> {
        throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
    }

    update(id: number, dto: EligibleVoter): Promise<EligibleVoter | undefined> {
        throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
    }
    delete(id: number): Promise<void> {
        throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
    }

    async storeVerificationHash(identification: string, hash: string): Promise<EligibleVoter | undefined> {
        const eligibleVoter = await this._repo.findOne({ where: { identification: identification } })
        if (!eligibleVoter) throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })

        eligibleVoter.verification = hash
        return await this._repo.save(eligibleVoter)
    }

    async getVoterByIdentification(identification: string) {
        const voter: EligibleVoter | undefined = await this._repo.findOne({ identification })

        if (!voter) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
        }

        return voter
    }

    /**
     * Generates a unique verification string of the eligible voters properties. This string can
     * be used to generate a hash
     * @param voter the eligible voter to create a unique identifying verification string of
     * @returns
     */
    generateVerificationString(voter: EligibleVoter) {
        const identificationForMail = voter.identification.split('@')[0]

        return identificationForMail + voter.id
    }

    async getVerificationHash(hash: string) {
        const voter = await this._repo.findOne({ verification: hash })
        if (!voter) throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
        return voter
    }

    async markAsVerified(voter: EligibleVoter) {
        return await this._repo.update(voter, { verification: '', verified: new Date() })
    }
}
