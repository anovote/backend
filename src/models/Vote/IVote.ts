export interface IVote {
    candidate: number | 'blank' | null
    submitted: Date
    voter: number
    ballot: number
}
