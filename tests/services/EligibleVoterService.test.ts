import { EligibleVoter } from '@/models/EligibleVoter/EligibleVoterEntity'
import { EligibleVoterService } from '@/services/EligibleVoterService'

let eligibleVoters: EligibleVoter[]
let eligibleVoterService: EligibleVoterService

beforeAll(() => {
    eligibleVoterService = new EligibleVoterService()
    eligibleVoters = [
        {
            id: 1,
            identification: 'hallai@nrk.no'
        },
        {
            id: 2,
            identification: 'hissig@sturla.net'
        },
        {
            id: 3,
            identification: '        moffeloff@svg.no        '
        },
        {
            id: 4,
            identification: 'hello'
        }
    ]
})

it('should correct the list of eligible voters', () => {
    let copy = [...eligibleVoters]
    copy = eligibleVoterService.correctListOfEligibleVoters(copy)
    expect(copy.length).toBe(3)
    expect(copy[2]).toBe('moffeloff@svg.no')
})
