import { ICandidateStats } from './ICandidateStats'

export interface IBallotStats {
    ballotId: number
    stats: {
        total: number
        votes: number
        blank: number
        candidates: Array<ICandidateStats>
    }
}
