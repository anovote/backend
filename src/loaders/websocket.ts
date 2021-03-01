import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
import { Application } from 'express'
import http from 'http'
import { Server } from 'socket.io'

export default (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)
    const socket = new Server(httpServer, {})

    // RECEIVE EVENTS
    const stopElection = 'stopElection'
    const createElection = 'createElection'
    const vote = 'vote'
    // SEND EVENTS
    const publishBallot = 'publishBallot'
    const confirmVote = 'confirmVote'

    socket.use(validateConnection)
    /**
     *
     * ID on election is room name
     */
    socket.on('connection', (socket) => {
        socket.on('ping', () => {
            console.log('Got ping')

            socket.send('pong')
        })
    })
    // !TODO add to config
    httpServer.listen(8877)
}
