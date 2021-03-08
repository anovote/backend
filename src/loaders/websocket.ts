import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
import { SocketRoomState } from '@/models/SocketRoom/SocketRoomEntity'
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
    socketServer.on('connection', async (socketConnection: AnoSocket) => {
        const socketId = chalk.blue(socketConnection.id)
        const { token } = socketConnection
        logger.info(`${socketId} was connected`)

        if (token.electionID) {
            const room = await socketRoomService.getById(token.electionID!)
            const openRoom = room?.roomState === SocketRoomState.OPEN
            if (openRoom) {
                const electionIdString = token.electionID!.toString()
                logger.info(`${socketId} was added to election room ${electionIdString}`)
                await socketConnection.join(electionIdString)
                socketServer.to(electionIdString).send(`You have joined election room: ${electionIdString}`)
            } else {
                logger.info(
                    `tried to connect to room ${token.electionID}. This room is either closed or does not exist`
                )
            }
        }

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
    })

    // !TODO add to config
    httpServer.listen(process.env.WS_PORT)
}
