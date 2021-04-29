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

    // Todo: verify that the ballot is the current
    // Todo: send error if ballot does not exist
    // Todo: send error if ballot is not current (not sent, or ended)
    // Todo: send error if candidate is not existing on ballot
    // Todo: verify that a vote has not more candidates than allowed
    // Todo: assign points to RANKED votes according to order of candidates
    try {
        if (!submittedVote.ballot || !submittedVote.voter) {
            let isMissing = ''
            if (!submittedVote.ballot) isMissing = 'Ballot id'
            else isMissing = 'voter'
            throw new BadRequestError({ message: ServerErrorMessage.isMissing(isMissing) })
        }

        const room = socketRoomService.getRoom(voterSocket.electionCode)

        if (!room) {
            throw new NotFoundError({
                message: ServerErrorMessage.notFound('Election room'),
                code: 'ELECTION_ROOM_NOT_EXIST'
            })
        }

        const ballotId = submittedVote.ballot

        let ballot: Ballot | undefined

        // Create vote first so we know it at least inserts into the database
        await voteService.create(submittedVote)

        // Add the vote to the room
        room.addVote({ ballotId, voterId: voterSocket.voterId, votes: [submittedVote] })

        // Check if all voters have voted
        const allVoted = room.haveAllVotedOnBallot(ballotId)

        if (allVoted) {
            const ballotService = new BallotService(database, new ElectionService(database))
            ballot = await ballotService.getByIdWithoutOwner(ballotId)
            if (ballot) {
                ballot.status = BallotStatus.IN_ARCHIVE
                await ballotService.update(ballotId, ballot)
            }
        }

        if (room.organizerSocketId) {
            const organizer = event.server.to(room.organizerSocketId)
            if (allVoted && ballot) organizer.emit(Events.server.ballot.update, { ballot })
            organizer.emit(Events.server.vote.newVote, room.getBallotStats(ballotId))
        }

        logger.info('A vote was submitted')
        event.acknowledgement(EventMessage())
    } catch (err) {
        logger.error(err)
        // Only emit errors that is safe to emit
        if (err instanceof BaseError) event.acknowledgement(EventErrorMessage(err))
    }
}
