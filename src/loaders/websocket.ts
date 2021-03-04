import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
import { Application } from 'express'
import http from 'http'
import { Server } from 'socket.io'

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

    socketServer.use(validateConnection)
    /**
     *
     * ID on election is room name
     */
    socketServer.on('connection', (socketConnection: AnoSocket) => {
        if (socketConnection.token.organizer) {
            // TODO Add organizer events
            console.log('is organizer')
        } else {
            // TODO Add voter events
            console.log('is not organizer')
        }
        socketConnection.on('ping', () => {
            console.log('Got ping')
            socketConnection.send('pong')
        })
    })
    // !TODO add to config
    httpServer.listen(8877)
}
