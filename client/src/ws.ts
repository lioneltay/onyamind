import io from "socket.io-client"
import axios from "axios"

const host = "http://localhost:3030"

// export const socket = io(host, {
//   query: { yo: "booo" },
// })

export function connect() {
  return io(host, {
    query: {
      token: axios.defaults.headers.Authorization,
    },
  })
}
