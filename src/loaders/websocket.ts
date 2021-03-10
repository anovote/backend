import config from '@/config'
import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { join } from '@/lib/events/join'
import { verify } from '@/lib/events/verify'
import { SocketRoomService } from '@/services/SocketRoomService'
import chalk from 'chalk'
import { Application } from 'express'
import http from 'http'
import { Server } from 'socket.io'
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
    socketServer.on('connection', (socketConnection: AnoSocket) => {
        const socketId = socketConnection.id
        logger.info(`${chalk.blue(socketId)} was connected`)

        await socketRoomService.addUserToRoom(socketConnection, socketServer)

        // if (socketConnection.token.organizer) {
        //     // TODO Add organizer events
        //     console.log('is organizer')
        // } else {
        //     // TODO Add voter events
        //     console.log('is not organizer')
        // }

        socketConnection.on('join', (data) => join(socketConnection, data))

        socketConnection.on('verify_voter_integrity', (data) => verify(socketConnection, data))

        socketConnection.onAny((event, ...args) => {
            // console.log(event)
            // console.log(args)
        })
        socketConnection.on('ping', () => {
            logger.info(`Got ping from ${socketId}`)
            socketConnection.send('pong')
        })

        socketConnection.on('disconnect', (reason) => {
            logger.info(`${socketId} was disconnected due to: ${reason}`)
        })
    })

    httpServer.listen(config.ws.port)
}
