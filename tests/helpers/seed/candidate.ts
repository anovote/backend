import { Ballot } from '@/models/Ballot/BallotEntity'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Connection } from 'typeorm'

export const createDummyCandidate = async (database: Connection, ballot: Ballot): Promise<Candidate> => {
    const repository = database.getRepository(Candidate)

    const candidate = new Candidate()
    candidate.candidate = 'Hurlen Holanger'
    candidate.ballot = ballot

    repository.create(candidate)
    return await repository.save(candidate)
}
