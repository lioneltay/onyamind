import Express = require("express")
import * as bodyParser from "body-parser"
import * as cors from "cors"
import { createServer } from "http"

import configWS from './init/ws'

import applyRoutes from "routes"

const app = Express()

const server = createServer(app)
configWS(server, app)

app.use(cors())
app.use(bodyParser.json())

applyRoutes(app)

app.get("*", (req, res) => {
  res.send("Didn't hit a route this time :/")
})

const PORT = process.env.PORT || 3030
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
