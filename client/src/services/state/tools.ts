import { createObservableStateTools } from "lib/rxstate"
import { State } from "./index"

export const tools = createObservableStateTools<State>()

export const createDispatcher = tools.createDispatcher
console.log("CREATE DISPATCHER", createDispatcher)

export const connect = tools.connect
