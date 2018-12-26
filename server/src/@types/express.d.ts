import { Server } from "socket.io"

declare global {
  namespace Express {
    export interface Response {
      socketio: Server
    }
  }
}

export {}
