import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IBallot } from '../Ballot/IBallot'
import { IEligibleVoter } from '../EligibleVoter/EligibleVoterEntity'
import { ElectionStatus } from './ElectionStatus'

export interface IElection {
    electionOrganizer: ElectionOrganizer
    title: string
    description: string
    image?: string
    openDate?: Date
    closeDate?: Date
    password?: string
    status: ElectionStatus
    eligibleVoters: IEligibleVoter[]
    ballots: IBallot[]
    isLocked: boolean
    isAutomatic: boolean
}
