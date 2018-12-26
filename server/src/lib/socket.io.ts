import { Server } from "socket.io"

export function emitToOthers(
  io: Server,
  token: string,
  event: string,
  msg: any,
) {
  const socket_obj = io.clients().sockets
  const sockets = Object.keys(socket_obj).map(key => socket_obj[key])

  const emit_to = sockets.filter(
    socket => socket.handshake.query.token !== token,
  )

  emit_to.forEach(socket => {
    socket.emit(event, msg)
  })
}
