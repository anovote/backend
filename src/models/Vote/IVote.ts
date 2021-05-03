import { Candidate } from '../Candidate/CandidateEntity'

export interface IVote {
    candidate: number | 'blank' | null | Candidate
    submitted: Date
    voter: number
    ballot: number
}
