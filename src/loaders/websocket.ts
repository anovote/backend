import config from '@/config'
import { AnoSocket } from '@/lib/websocket/AnoSocket'
import { Events } from '@/lib/websocket/events'
import { tokenJoin } from '@/lib/websocket/events/client/tokenJoin'
import { join } from '@/lib/websocket/events/client/voter/join'
import { verify } from '@/lib/websocket/events/client/voter/verify'
import { disconnect } from '@/lib/websocket/events/standard/disconnect'
import { ping } from '@/lib/websocket/events/standard/ping'
import { validateConnection } from '@/lib/websocket/middleware/ValidateConnection'
import { SocketRoomService } from '@/services/SocketRoomService'
import chalk from 'chalk'
import { Application } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { logger } from './logger'

export default async (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)
    const socketServer = new Server(httpServer, {
        cors: { origin: '*' }
    })

    const socketRoomService = SocketRoomService.getInstance()
    await socketRoomService.loadElections()

    socketServer.use(validateConnection)
    /**
     *
     * ID on election is room name
     */
    socketServer.on(Events.standard.socket.connect, (socketConnection: AnoSocket) => {
        logger.info(`${chalk.blue(socketConnection.id)} connected`)

        const sockets = { client: socketConnection, server: socketServer }

        // standard events
        socketConnection.on(Events.standard.socket.disconnect, (data) => disconnect({ ...sockets, data }))
        socketConnection.on(Events.standard.manager.ping, (data) => ping({ ...sockets, data }))

        socketConnection.on(Events.client.auth.withToken, (data, acknowledgement) => {
            tokenJoin({ ...sockets, data, acknowledgement })
        })
        // voter events
        socketConnection.on(Events.client.auth.join, (data, acknowledgement) =>
            join({ ...sockets, data, acknowledgement })
        )
        socketConnection.on(Events.client.auth.verify.voterIntegrity, (data, acknowledgement) =>
            verify({ ...sockets, data, acknowledgement })
        )
    })

    httpServer.listen(config.ws.port)
}
