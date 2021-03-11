import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
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

        await socketRoomService.addUserToRoom(socketConnection, socketServer)

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

        socketConnection.on('pushBallot', (ballot: Ballot, fn) => {
            console.log(ballot)
            const { id } = ballot.election
            // todo set right room id
            socketServer.to(`ElectionRoom: ${id} `).emit('ballot', ballot)

            console.log('send ack')

            fn({ status: StatusCodes.OK, message: 'got it' })
        })

        socketConnection.on('disconnect', (reason) => {
            logger.info(`${socketId} was disconnected due to: ${reason}`)
        })
    })

    // !TODO add to config
    httpServer.listen(process.env.WS_PORT)
}
