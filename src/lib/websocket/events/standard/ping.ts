import { logger } from '@/loaders/logger'
import { Events } from '..'
import { EventHandler } from '../EventHandler'

/**
 * Receives and sends a ping to the client
 * @param socket the anosocket to work with
 * @param data optional data that may be passed with the event
 */
export const ping: EventHandler<string> = (data, socket) => {
    const socketId = socket.id
    const ping = Events.standard.manager

    logger.info(`Got ${ping} from ${socketId}, responding with ${ping}`)
    socket.send(ping)
}
