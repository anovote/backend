import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
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
    isLocked: boolean
    isAutomatic: boolean
}
