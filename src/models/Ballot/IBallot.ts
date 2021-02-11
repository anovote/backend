import { Candidate } from '@/models/Candidate/CandidateEntity'
import { BallotResultDisplay } from './BallotResultDisplay'
import { BallotType } from './BallotType'

export interface IBallot {
  election: number
  title: string
  description?: string
  image?: string
  type: BallotType
  resultDisplayType: BallotResultDisplay
  resultDisplayTypeCount: number
  displayResultCount: boolean
  order: number
  candidates: Candidate[]
}
