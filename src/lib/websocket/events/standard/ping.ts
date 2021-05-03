import { EventHandler } from '@/lib/websocket/EventHandler'
import { logger } from '@/loaders/logger'
import chalk from 'chalk'
import { Events } from '..'

/**
 * Receives and sends a ping to the client
 * @param socket the anosocket to work with
 * @param data optional data that may be passed with the event
 */
export const ping: EventHandler<string> = (event) => {
    const socketId = event.client.id
    const { ping, pong } = Events.standard.manager

    logger.info(`Got ${chalk.yellow(ping)} from ${chalk.blue(socketId)}, responding with ${chalk.redBright(pong)}`)
    event.client.send(pong)
}
