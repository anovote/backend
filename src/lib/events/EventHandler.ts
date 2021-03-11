import { AnoSocket } from '../errors/websocket/AnoSocket'
import { CallbackType } from './CallbackType'

/**
 * Handles an event
 * @param data the data object passed along the event from the client
 * @param socket the socket the event exists on, can be used to get information about the socket connection or emit new events
 */
export type EventHandler<T> = (data: T, socket: AnoSocket) => void

/**
 * Handles an event that should respond with an acknowledgement
 * @param data the data object passed along the event from the client
 * @param cb the callback to respond to an event with
 * @param socket the socket the event exists on, can be used to get information about the socket connection or emit new events
 */
export type EventHandlerAcknowledges<T> = (data: T, socket: AnoSocket, cb: (arg: CallbackType) => void) => void
