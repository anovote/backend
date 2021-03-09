import { WebSocketService } from '@/lib/errors/websocket/WebSocketService'
// import { Server } from 'mock-socket'
import { Server } from 'socket.io'
import { AnoSocket } from 'lib/errors/websocket/AnoSocket'

let webSocketService: WebSocketService
jest.mock('socket.io')

beforeAll(() => {
    webSocketService = WebSocketService.getInstance()
})

it('should add user to room', async () => {
    const socket = { token: { electionID: 6 } } as AnoSocket
    const server = new Server()
    await webSocketService.addUserToRoom(socket, server)
})
