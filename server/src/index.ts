import { createConnection } from "typeorm"
import Express = require("express")
import * as bodyParser from "body-parser"
import * as cors from 'cors'

import applyRoutes from "routes"

const app = Express()

async function init() {
  await createConnection()

  app.use(cors())
  app.use(bodyParser.json())

  applyRoutes(app)

  app.get("*", (req, res) => {
    res.send("Didn't hit a route this time :/")
  })

  const PORT = process.env.PORT || 3030
  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
  })
}

init()
