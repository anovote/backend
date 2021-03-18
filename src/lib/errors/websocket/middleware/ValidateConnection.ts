import { logger } from '@/loaders/logger'
import { AuthenticationService } from '@/services/AuthenticationService'
import chalk from 'chalk'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { ForbiddenError } from '../../http/ForbiddenError'
import { AnoSocket } from '../AnoSocket'

/**
 *  SocketIO middleware for validating tokens on authenticating clients
 */
export const validateConnection = (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
        next()
    } catch (error) {
        logger.error(`${chalk.blue(socket.id)}:  ${error}`)
        next(new ForbiddenError())
    }
}
