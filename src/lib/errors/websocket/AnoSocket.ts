import { DecodedTokenValue } from '@/services/AuthenticationService'
import { Socket } from 'socket.io'

export interface AnoSocket extends Socket {
    token: DecodedTokenValue
}
