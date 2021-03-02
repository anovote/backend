import { AuthenticationService } from '@/services/AuthenticationService'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { ForbiddenError } from '../../http/ForbiddenError'
import { AnoSocket } from '../AnoSocket'

/**
 *  SocketIO middleware for validating tokens on authenticating clients
 */
export const validateConnection = (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
        // !TODO Expect token here
        const token = socket.handshake.auth.token
        const authenticationService = new AuthenticationService()
        const decodedToken = authenticationService.verifyToken(token)
        const upgradedSocket = socket as AnoSocket
        upgradedSocket.token = decodedToken
        next()
    } catch (error) {
        next(new ForbiddenError())
    }
}
