import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { Connection } from 'typeorm'
import BaseEntityService from './BaseEntityService'
import { filterForDuplicates, trimItemsInArray } from '@/helpers/array'
import { isEmailValid } from '@/helpers/email'
import { EligibleVoter, IEligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'

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

    /**
     * Checks if the voter is already verified, returns true if verified, else false
     * @param voter the voter to check for verification
     * @returns true if voter is verified, else false
     */
    isVerified(voter: EligibleVoter) {
        return voter.verified != null
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

    /**
     * Returns the voter with given identification on given election id.
     * If the voter and relation ship exists, returns the voter, else undefined
     * @param identification the identification for voter
     * @param electionId the election id it belongs to
     * @returns voter or undefined if not found
     */
    async getVoterByIdentificationForElection(identification: string, electionId: number) {
        return await this.repository
            .createQueryBuilder('voter')
            .leftJoinAndSelect('voter.elections', 'election')
            .where('election.id = :electionId AND voter.identification = :identification', {
                electionId: electionId,
                identification: identification
            })
            .getOne()
    }

    /**
     * Marks the voter verified
     * @param voter the voter to mark as verified
     * @returns
     */
    async markAsVerified(voter: EligibleVoter) {
        return await this.repository.update(voter, { verified: new Date() })
    }

    /**
     * Corrects a list of eligible voters. The list will be
     * corrected of any whitespace. Any duplicates will be removed
     * and invalid identifications will be removed.
     * @param eligibleVoters the list to be corrected
     * @returns corrected list of eligible voters
     */
    correctListOfEligibleVoters(eligibleVoters: IEligibleVoter[]): IEligibleVoter[] {
        let arrayOfIdentifications: string[] = []
        arrayOfIdentifications = this.createArrayOfIdentifications(eligibleVoters)

        let trimmedIdentifications: string[] = []
        trimmedIdentifications = trimItemsInArray(arrayOfIdentifications)

        let noDuplicateIdentifications: string[] = []
        noDuplicateIdentifications = filterForDuplicates(trimmedIdentifications)

        const validEmails: string[] = []
        for (let i = 0; i < noDuplicateIdentifications.length; i++) {
            if (isEmailValid(noDuplicateIdentifications[i])) {
                validEmails.push(noDuplicateIdentifications[i])
            }
        }

        let correctEligibleVoters: EligibleVoter[] = []
        correctEligibleVoters = this.createArrayOfEligibleVoters(validEmails)

        return correctEligibleVoters
    }

    async getVoterByIdentification(identification: string) {
        const voter: EligibleVoter | undefined = await this.repository.findOne({ identification })

        if (!voter) {
            throw new NotFoundError({ message: ServerErrorMessage.notFound('Eligible Voter') })
        }

        return voter
    }

    /**
     * Creates an array of identifications from a given array
     * of eligible voters, the identification is also made to lowercase.
     * @param eligibleVoters list of eligible voters
     * @returns array of identifications
     */
    private createArrayOfIdentifications(eligibleVoters: IEligibleVoter[]): string[] {
        const array: string[] = []

        for (let i = 0; i < eligibleVoters.length; i++) {
            array.push(eligibleVoters[i].identification.toLowerCase())
        }

        return array
    }

    /**
     * Creates an array of eligible voters from a given array
     * of identifications.
     * @param identifications list of identifications
     * @returns list of eligible voters
     */
    private createArrayOfEligibleVoters(identifications: string[]): EligibleVoter[] {
        const eligibleVoters: EligibleVoter[] = []

        for (let i = 0; i < identifications.length; i++) {
            const newVoter = new EligibleVoter()
            newVoter.identification = identifications[i]
            eligibleVoters.push(newVoter)
        }

        return eligibleVoters
    }
}
