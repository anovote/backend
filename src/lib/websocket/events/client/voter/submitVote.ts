import { BaseError } from '@/lib/errors/BaseError'
import { BadRequestError } from '@/lib/errors/http/BadRequestError'
import { NotFoundError } from '@/lib/errors/http/NotFoundError'
import { ServerErrorMessage } from '@/lib/errors/messages/ServerErrorMessages'
import { EventHandlerAcknowledges } from '@/lib/websocket/EventHandler'
import { EventErrorMessage, EventMessage } from '@/lib/websocket/EventResponse'
import { database } from '@/loaders'
import { logger } from '@/loaders/logger'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { BallotStatus } from '@/models/Ballot/BallotStatus'
import { IVote } from '@/models/Vote/IVote'
import { BallotService } from '@/services/BallotService'
import { ElectionService } from '@/services/ElectionService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { VoteService } from '@/services/VoteService'
import { Events } from '@/lib/websocket/events'
import { VoterSocket } from '@/lib/websocket/AnoSocket'
import { Election } from '@/models/Election/ElectionEntity'
import chalk from 'chalk'
import { ElectionRoom } from '@/lib/election/ElectionRoom'

/**
 * Submits a vote with the given vote details
 * @param data data from event
 * @param socket the socket
 * @param cb the callback to send acknowledgements with
 */
export const submitVote: EventHandlerAcknowledges<IVote> = async (event) => {
    const voterSocket = event.client as VoterSocket
    const submittedVote: IVote = event.data
    const voteService = new VoteService(database)
    const socketRoomService = SocketRoomService.getInstance()

    // Todo: send error if ballot does not exist
    // Todo: send error if ballot is not current (not sent, or ended)
    // Todo: send error if candidate is not existing on ballot
    // Todo: verify that a vote has not more candidates than allowed
    // Todo: assign points to RANKED votes according to order of candidates
    try {
        validateSubmittedVote(submittedVote)

        const room = socketRoomService.getRoom(voterSocket.electionCode)

        if (!room) {
            throw new NotFoundError({
                message: ServerErrorMessage.notFound('Election room'),
                code: 'ELECTION_ROOM_NOT_EXIST'
            })
        }

        const ballotId = submittedVote.ballot

        let ballot: Ballot | undefined
        let election: Election | undefined

        // Create vote first so we know it at least inserts into the database
        await voteService.create(submittedVote)

        // Add the vote to the room
        room.addVote({ ballotId, voterId: voterSocket.voterId, votes: [submittedVote] })

        // Check if all voters have voted
        const allVoted = room.haveAllVotedOnBallot(ballotId)
        if (allVoted) {
            ballot = await finishBallotForRoom(ballotId, room)
        }

        const allBallotsVotedOn = room.haveAllBallotsBeenVotedOn()
        if (allBallotsVotedOn) {
            election = await finishElection(ballot, election)
        }

        // update with a new vote
        if (room.organizerSocketId) {
            const organizer = event.server.to(room.organizerSocketId)

            if (allVoted && ballot) organizer.emit(Events.server.ballot.update, { ballot })
            if (allBallotsVotedOn) organizer.emit(Events.server.election.finish, { election })

            organizer.emit(Events.server.vote.newVote, room.getBallotStats(ballotId))
        }

        logger.info('A vote was submitted')
        event.acknowledgement(EventMessage())

        if (allVoted && ballot) {
            logger.info(`-> ${chalk.redBright(`ballot (${ballot.id})`)} : all votes submitted`)
        }

        if (allBallotsVotedOn && election) {
            logger.info(`-> ${chalk.green(`election (${election.id})`)} : all ballots voted on`)
        }
    } catch (err) {
        logger.error(err)
        // Only emit errors that is safe to emit
        if (err instanceof BaseError) event.acknowledgement(EventErrorMessage(err))
    }
}

/**
 * Checks if the submitted vote is missing ballot or a voter. Throws an error if something is missing
 * @param submittedVote the vote to validate
 */
function validateSubmittedVote(submittedVote: IVote) {
    if (!submittedVote.ballot || !submittedVote.voter) {
        let typeMissing = ''
        if (!submittedVote.ballot) {
            typeMissing = 'Ballot id'
        } else {
            typeMissing = 'voter'
        }
        throw new BadRequestError({ message: ServerErrorMessage.isMissing(typeMissing) })
    }
}

/**
 * Finishes the election when a ballot has all voters added.
 * @param ballot the ballot to that have been finished
 * @param election the election the ballot is a part of
 * @returns the updated election
 */
async function finishElection(ballot: Ballot | undefined, election: Election | undefined) {
    const electionService = new ElectionService(database)
    if (ballot) {
        const entity = await electionService.getElectionById(ballot.election.id)
        if (entity) {
            // update election as finished, but not close election completely
            election = await electionService.markElectionClosed(entity, false)
        }
    }
    return election
}

/**
 * Finishes a ballot for a given room
 * @param ballotId the ballot id to finish
 * @param room the room the ballot belongs to
 * @returns
 */
async function finishBallotForRoom(ballotId: number, room: ElectionRoom) {
    const ballotService = new BallotService(database, new ElectionService(database))
    const ballot = await ballotService.getByIdWithoutOwner(ballotId)
    if (ballot) {
        ballot.status = BallotStatus.IN_ARCHIVE
        // submit the update to the database
        await ballotService.update(ballotId, ballot)

        room.updateVoteInformationBallot(ballot)
    }
    return ballot
}
