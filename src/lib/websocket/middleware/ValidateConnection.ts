import { logger } from '@/loaders/logger'
import chalk from 'chalk'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { ForbiddenError } from '../../errors/http/ForbiddenError'

/**
 *  SocketIO middleware for validating tokens on authenticating clients
 */
export const validateConnection = (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
        const token = socket.handshake.auth.token
        // if (token) {
        //     const upgradedSocket = socket as AnoSocket
        //     const authenticationService = new AuthenticationService()
        //     const decodedToken = authenticationService.verifyToken(token)
        // }
        next()
    } catch (error) {
        logger.error(`${chalk.blue(socket.id)}:  ${error}`)
        next(new ForbiddenError())
    }
}
