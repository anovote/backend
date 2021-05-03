import { logger } from '@/loaders/logger'
import { EventHandler } from '@/lib/websocket/EventHandler'

/**
 * Fired on client disconnect from socket. This event is mainly used to track the reason for a disconnect and log when it happened
 * @param socket the anosocket to work with
 * @param data info about why the disconnect happened
 */
export const disconnect: EventHandler<unknown> = (event) => {
    logger.info(`${event.client.id} disconnected due to: ${event.data}`)
}
