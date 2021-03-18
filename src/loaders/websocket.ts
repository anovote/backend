import config from '@/config'
import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { Events } from '@/lib/events'
import { join } from '@/lib/events/client/join'
import { verify } from '@/lib/events/client/verify'
import { submitVote } from '@/lib/events/client/submitVote'
import { disconnect } from '@/lib/events/standard/disconnect'
import { ping } from '@/lib/events/standard/ping'
import { SocketRoomService } from '@/services/SocketRoomService'
import { VoteService } from '@/services/VoteService'
import chalk from 'chalk'
import { Application } from 'express'
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import { Server } from 'socket.io'
import { database } from '.'
import { logger } from './logger'
import { Vote } from '@/models/Vote/VoteEntity'

export default (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)
    const socketServer = new Server(httpServer, {})

    const socketRoomService = SocketRoomService.getInstance()

    socketServer.use(validateConnection)
    /**
     *
     * ID on election is room name
     */
    socketServer.on(Events.standard.socket.connect, async (socketConnection: AnoSocket) => {
        logger.info(`${chalk.blue(socketConnection.id)} connected`)

        //await socketRoomService.addUserToRoom(socketConnection, socketServer)

        // if (socketConnection.token.organizer) {
        //     // TODO Add organizer events
        //     console.log('is organizer')
        // } else {
        //     // TODO Add voter events
        //     console.log('is not organizer')
        // }

        // standard events
        socketConnection.on(Events.standard.socket.disconnect, (reason) => disconnect(reason, socketConnection))
        socketConnection.on(Events.standard.manager.ping, (data) => ping(data, socketConnection))

        socketConnection.on('pushBallot', (ballot: Ballot, fn) => {
            console.log(ballot)
            const { id } = ballot.election
            // todo set right room id
            socketServer.to(`ElectionRoom: ${id} `).emit('ballot', ballot)

            console.log('send ack')

            fn({ status: StatusCodes.OK, message: 'got it' })
        })

        socketConnection.on('disconnect', (reason) => {
            logger.info(`${chalk.blue(socketConnection.id)} was disconnected due to: ${reason}`)
        })
        // voter events
        socketConnection.on(Events.client.auth.join, (data, callback) => join(data, socketConnection, callback))
        socketConnection.on(Events.client.auth.verify.voterIntegrity, (data, callback) =>
            verify(data, socketConnection, callback)
        )
        socketConnection.on(Events.client.vote.submit, (vote, acknowledgement) =>
            submitVote(vote, socketConnection, acknowledgement)
        )
    })

    httpServer.listen(config.ws.port)
}
