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
            identification: 'hissig@sturla.net'
        },
        {
            id: 4,
            identification: 'hissig@sturla.net'
        },
        {
            id: 5,
            identification: '        moffeloff@svg.no        '
        },
        {
            id: 6,
            identification: 'hello'
        }
    ]
})

it('should correct the list of eligible voters', () => {
    let copy: EligibleVoter[] = []
    copy = eligibleVoterService.correctListOfEligibleVoters(eligibleVoters)
    expect(copy.length).toBe(3)
    expect(copy[2].identification).toContain('moffeloff@svg.no')
})

it('should not change already correct identifications', () => {
    let copy: EligibleVoter[] = []
    copy = eligibleVoterService.correctListOfEligibleVoters(eligibleVoters)
    expect(copy[0].identification).toContain('hallai@nrk.no')
    expect(copy[1].identification).toContain('hissig@sturla.net')
})
