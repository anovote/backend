import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { Connection } from 'typeorm'
import BaseEntityService from './BaseEntityService'

export class EligibleVoterService extends BaseEntityService<EligibleVoter> {
    constructor(db: Connection) {
        super(db, EligibleVoter)
    }

    get(): Promise<EligibleVoter[] | undefined> {
        throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
    }

    async getById(id: number): Promise<EligibleVoter | undefined> {
        const voter = await this.repository.findOne(id)
        if (!voter) throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
        return voter
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
        const eligibleVoter = await this.repository.findOne({ where: { identification: identification } })
        if (!eligibleVoter) throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })

        eligibleVoter.verification = hash
        return await this.repository.save(eligibleVoter)
    }

    async getVoterByIdentification(identification: string) {
        const voter: EligibleVoter | undefined = await this.repository.findOne({ identification })

        if (!voter) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
        }

        return voter
    }

    /**
     * Marks the voter verified
     * @param voter the voter to mark as verified
     * @returns
     */
    async markAsVerified(voter: EligibleVoter) {
        return await this.repository.update(voter, { verification: '', verified: new Date() })
    }
}
