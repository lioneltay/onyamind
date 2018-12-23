import { Express } from "express"
import taskRoutes from "./task"

export default (app: Express) => {
  taskRoutes(app)
}
