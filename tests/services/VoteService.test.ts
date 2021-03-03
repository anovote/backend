import { Ballot } from '@/models/Ballot/BallotEntity'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { IVote } from '@/models/Vote/IVote'
import { Vote } from '@/models/Vote/VoteEntity'
import { VoteService } from '@/services/VoteService'
import { Connection } from 'typeorm'
import setupConnection from '../helpers/setupTestDB'

let db: Connection
let ballot: Ballot
let candidate: Candidate
let voteService: VoteService
let seedVote: Vote
let seedDTO: IVote

beforeAll(async () => {
    db = await setupConnection()
})
