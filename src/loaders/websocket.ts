import config from '@/config'
import { BallotVoteStats } from '@/lib/voting/BallotStats'
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
import { Socket } from 'dgram'
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

        const sockets = { client: socketConnection, server: socketServer }

        //await socketRoomService.addUserToRoom(socketConnection, socketServer)
        // standard events
        socketConnection.on(Events.standard.socket.disconnect, (data) => disconnect({ ...sockets, data }))
        socketConnection.on(Events.standard.manager.ping, (data) => ping({ ...sockets, data }))

        socketConnection.on('disconnect', (reason) => {
            logger.info(`${chalk.blue(socketConnection.id)} was disconnected due to: ${reason}`)
        })
        // voter events
        socketConnection.on(Events.client.auth.join, (data, acknowledgement) =>
            join({ ...sockets, data, acknowledgement })
        )
        socketConnection.on(Events.client.auth.verify.voterIntegrity, (data, acknowledgement) =>
            verify({ ...sockets, data, acknowledgement })
        )
        socketConnection.on(Events.client.vote.submit, (data, acknowledgement) =>
            submitVote({ ...sockets, data, acknowledgement })
        )
    })

    httpServer.listen(config.ws.port)
}
