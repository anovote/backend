import config from '@/config'
import { AnoSocket } from '@/lib/websocket/AnoSocket'
import { Events } from '@/lib/websocket/events'
import { join } from '@/lib/websocket/events/client/join'
import { submitVote } from '@/lib/websocket/events/client/submitVote'
import { verify } from '@/lib/websocket/events/client/verify'
import { disconnect } from '@/lib/websocket/events/standard/disconnect'
import { ping } from '@/lib/websocket/events/standard/ping'
import { validateConnection } from '@/lib/websocket/middleware/ValidateConnection'
import { Ballot } from '@/models/Ballot/BallotEntity'
import { SocketRoomService } from '@/services/SocketRoomService'
import chalk from 'chalk'
import { Application } from 'express'
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import { Server } from 'socket.io'
import { logger } from './logger'

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
