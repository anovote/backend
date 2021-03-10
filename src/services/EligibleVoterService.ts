import { filterForDuplicates } from '@/helpers/array'
import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'

export class EligibleVoterService {
    correctListOfEligibleVoters(eligibleVoters: EligibleVoter[]): EligibleVoter[] {
        let copy = [...eligibleVoters]

        for (let i = 0; i < copy.length; i++) {
            copy[i].identification.trim()
        }

        copy = filterForDuplicates(copy)

        for (let i = 0; i < copy.length; i++) {
            if (!this.isEmailValid(copy[i].identification)) {
                delete copy[i]
            }
        }

        return copy
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

    private createArrayOfIdentifications(eligibleVoters: EligibleVoter[]): string[] {
        const array: string[] = []

        for (let i = 0; i < eligibleVoters.length; i++) {
            array.push(eligibleVoters[i].identification)
        }

        return array
    }
}
