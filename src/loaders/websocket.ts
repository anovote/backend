import { createDummyBallot } from '@/../tests/helpers/seed/ballot'
import { createDummyCandidate } from '@/../tests/helpers/seed/candidate'
import { createDummyElection } from '@/../tests/helpers/seed/election'
import { createDummyOrganizer } from '@/../tests/helpers/seed/organizer'
import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { Candidate } from '@/models/Candidate/CandidateEntity'
import { Election } from '@/models/Election/ElectionEntity'
import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { IVote } from '@/models/Vote/IVote'
import { SocketRoomService } from '@/services/SocketRoomService'
import { VoteService } from '@/services/VoteService'
import chalk from 'chalk'
import { Application } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { database } from '.'
import { logger } from './logger'

export default (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)
    const socketServer = new Server(httpServer, {})

    // RECEIVE EVENTS
    const stopElection = 'stopElection'
    const createElection = 'createElection'
    const vote = 'vote'
    // SEND EVENTS
    const publishBallot = 'publishBallot'
    const confirmVote = 'confirmVote'

    const socketRoomService = SocketRoomService.getInstance()

    socketServer.use(validateConnection)
    /**
     *
     * ID on election is room name
     */
    socketServer.on('connection', async (socketConnection: AnoSocket) => {
        const socketId = chalk.blue(socketConnection.id)
        logger.info(`${socketId} was connected`)

        //await socketRoomService.addUserToRoom(socketConnection, socketServer)

        // if (socketConnection.token.organizer) {
        //     // TODO Add organizer events
        //     console.log('is organizer')
        // } else {
        //     // TODO Add voter events
        //     console.log('is not organizer')
        // }

        socketConnection.on('ping', () => {
            logger.info(`Got ping from ${socketId}`)
            socketConnection.send('pong')
        })

        socketConnection.on('disconnect', (reason) => {
            logger.info(`${socketId} was disconnected due to: ${reason}`)
        })

        socketConnection.on('vote_submitted', async (vote: IVote) => {
            const organizer: ElectionOrganizer = await createDummyOrganizer(database)
            const election: Election = await createDummyElection(database, organizer)
            const ballot: Ballot = await createDummyBallot(database, election)
            const candidate: Candidate = await createDummyCandidate(database, ballot)
            const voteService: VoteService = new VoteService(database)

            vote = {
                candidate: candidate.id,
                voterId: 696969,
                submitted: new Date(),
                ballotId: ballot.id
            }

            await voteService.create(vote)
        })
    })

    // !TODO add to config
    httpServer.listen(process.env.WS_PORT)
}
