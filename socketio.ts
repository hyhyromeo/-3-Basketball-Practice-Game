import socketIO from 'socket.io'

export let io: socketIO.Server

export function setSocketIO(value: socketIO.Server) {
  io = value
  io.on('connection', socket => {
    console.log('client connected')
  })
}
