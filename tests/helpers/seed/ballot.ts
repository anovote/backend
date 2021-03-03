import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotResultDisplay } from '@/models/Ballot/BallotResultDisplay'
import { BallotStatus } from '@/models/Ballot/BallotStatus'
import { BallotType } from '@/models/Ballot/BallotType'
import { Election } from '@/models/Election/ElectionEntity'
import { Connection } from 'typeorm'

export const createDummyBallot = async (database: Connection, election: Election): Promise<Ballot> => {
    const repository = database.getRepository(Ballot)

    const ballot = new Ballot()
    ballot.election = election
    ballot.title = 'Ballot title'
    ballot.description = 'Ballot description'
    ballot.image = 'Ballot image'
    ballot.type = BallotType.SINGLE
    ballot.resultDisplayType = BallotResultDisplay.SINGLE
    ballot.resultDisplayTypeCount = 1
    ballot.displayResultCount = false
    ballot.order = 1
    ballot.status = BallotStatus.IN_QUEUE
    ballot.candidates = []

    repository.create(ballot)
    return await repository.save(ballot)
}
