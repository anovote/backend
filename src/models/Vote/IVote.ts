export interface IVote {
    candidate: number | 'blank' | null
    submitted: Date
    voterId: number
    ballotId: number
}
