import { AnoSocket } from '../errors/websocket/AnoSocket'
import { AcknowledgeResponse } from './AcknowledgeResponse'

/**
 * Handles an event
 * @param data the data object passed along the event from the client
 * @param socket the socket the event exists on, can be used to get information about the socket connection or emit new events
 */
export type EventHandler<T> = (data: T, socket: AnoSocket) => void

/**
 * Handles an event that should respond with an acknowledgement
 * @param data the data object passed along the event from the client
 * @param socket the socket the event exists on, can be used to get information about the socket connection or emit new events
 * @param acknowledgement the callback to respond to an event with
 */
export type EventHandlerAcknowledges<T> = (
    data: T,
    socket: AnoSocket,
    acknowledgement: (arg: AcknowledgeResponse) => void
) => void
