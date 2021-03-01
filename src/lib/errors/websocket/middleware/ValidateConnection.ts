import { AuthenticationService } from '@/services/AuthenticationService'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { ForbiddenError } from '../../http/ForbiddenError'

/**
 *  SocketIO middleware for validating tokens on authenticating clients
 */
export const validateConnection = (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
        // !TODO Expect token here
        const token = socket.handshake.auth.token
        const authenticationService = new AuthenticationService()

        authenticationService.verifyToken(token)
        console.log('validated')
        next()
    } catch (error) {
        next(new ForbiddenError())
    }
}
