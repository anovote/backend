// import { doesNotMatch } from 'assert'
// import { createServer, Server as htServer } from 'http'
// import { Server, Socket } from 'socket.io'

// let httpServer: htServer
// let io

// beforeAll((done) => {
//     httpServer = createServer()
//     io = new Server(httpServer, {
//         // ...
//     })

//     // io.on('connection', (socket: Socket) => {
//     //     socket.emit('wee')
//     // })

//     httpServer.listen(3000, () => done())
// })

// afterAll((done) => {
//     httpServer.listening ? httpServer.close(() => done()) : done()
// })

// test('should work', (done) => {
//     clientSocket.on('hello', (arg) => {
//         expect(arg).toBe('world')
//         done()
//     })
//     serverSocket.emit('hello', 'world')
// })
