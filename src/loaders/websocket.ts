import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
import { DecodedTokenValue } from '@/services/AuthenticationService'
import { Application } from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'

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
    socket.on('connection', (socket: AnoSocket) => {
        if (socket.token.organizer) {
            // TODO Add organizer events
            console.log('is organizer')
        } else {
            // TODO Add voter events
            console.log('is not organizer')
        }
        socket.on('ping', () => {
            console.log('Got ping')
            socket.send('pong')
        })

        socket.on(vote, (data) => {
            console.log(data)
        })
    })
    // !TODO add to config
    httpServer.listen(8877)
}
