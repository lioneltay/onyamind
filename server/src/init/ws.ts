import { Server } from "http"
import { Express } from "express"

import * as socketio from "socket.io"

export default (server: Server, app: Express): void => {
  const io = socketio(server)

  app.use((req, res, next) => {
    res.socketio = io
    next()
  })

  io.on("connection", socket => {
    console.log("A user has connected")

    socket.on("playground", (...msg) => {
      console.log(msg)
      console.log(typeof msg[1], msg[1])
      // Emit to everyone
      // io.emit('playground', `${msg} - RECEIVED`)
      // Emit to everyone but the current connection
      socket.broadcast.emit(
        "playground",
        `Someone else sent a playground message`,
        { obj: "value" },
      )
    })

    socket.on("disconnect", function() {
      socket.broadcast.emit("playground", `A DUDE HAS DISCONNECTED`)
      console.log("user disconnected")
    })
  })
}
