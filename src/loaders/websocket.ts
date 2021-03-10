import config from '@/config'
import { AnoSocket } from '@/lib/errors/websocket/AnoSocket'
import { validateConnection } from '@/lib/errors/websocket/middleware/ValidateConnection'
import { ElectionOrganizerService } from '@/services/ElectionOrganizerService'
import { ElectionService } from '@/services/ElectionService'
import { EligibleVoterService } from '@/services/EligibleVoterService'
import { EncryptionService } from '@/services/EncryptionService'
import { MailService } from '@/services/MailService'
import { SocketRoomService } from '@/services/SocketRoomService'
import { VoterVerificationService } from '@/services/VoterVerificationService'
import chalk from 'chalk'
import { Application } from 'express'
import http from 'http'
import { StatusCodes } from 'http-status-codes'
import { Server } from 'socket.io'
import { database } from '.'
import { logger } from './logger'
import mailTransporter from '@/loaders/nodemailer'
import { join } from '@/lib/events/join'
import { verify } from '@/lib/events/verify'

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
