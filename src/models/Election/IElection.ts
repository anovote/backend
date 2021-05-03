import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IBallot } from '../Ballot/IBallot'
import { IEligibleVoter } from '../EligibleVoter/EligibleVoterEntity'
import { IElectionBase } from './IElectionBase'

export interface IElection extends IElectionBase {
    electionOrganizer: ElectionOrganizer
    password?: string
    eligibleVoters: IEligibleVoter[]
    ballots: IBallot[]
}
