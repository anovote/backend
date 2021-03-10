import { filterForDuplicates, trimItemsInArray } from '@/helpers/array'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'

export class EligibleVoterService {
    /**
     * Corrects a list of eligible voters. The list will be
     * corrected of any whitespace. Any duplicates will be removed
     * and invalid identifications will be removed.
     * @param eligibleVoters the list to be corrected
     * @returns corrected list of eligible voters
     */
    correctListOfEligibleVoters(eligibleVoters: EligibleVoter[]): EligibleVoter[] {
        let arrayOfIdentifications: string[] = []
        arrayOfIdentifications = this.createArrayOfIdentifications(eligibleVoters)

        let trimmedIdentifications: string[] = []
        trimmedIdentifications = trimItemsInArray(arrayOfIdentifications)

        let noDuplicateIdentifications: string[] = []
        noDuplicateIdentifications = filterForDuplicates(trimmedIdentifications)

        const validEmails: string[] = []
        for (let i = 0; i < noDuplicateIdentifications.length; i++) {
            if (this.isEmailValid(noDuplicateIdentifications[i])) {
                validEmails.push(noDuplicateIdentifications[i])
            }
        }

        let correctEligibleVoters: EligibleVoter[] = []
        correctEligibleVoters = this.createArrayOfEligibleVoters(validEmails)

        return correctEligibleVoters
    }

    /**
     * Checks if a given email is valid or not.
     * @param email the email we want to validate
     * @returns true if valid, false if not valid
     */
    private isEmailValid(email: string): boolean {
        const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        if (email.match(emailFormat)) {
            return true
        } else {
            return false
        }
    }

    /**
     * Creates an array of identifications from a given array
     * of eligible voters.
     * @param eligibleVoters list of eligible voters
     * @returns array of identifications
     */
    private createArrayOfIdentifications(eligibleVoters: EligibleVoter[]): string[] {
        const array: string[] = []

        for (let i = 0; i < eligibleVoters.length; i++) {
            array.push(eligibleVoters[i].identification)
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
            eligibleVoters.push({ id: i, identification: identifications[i] })
        }

        return eligibleVoters
    }
}
