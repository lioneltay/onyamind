import { createObservableStateTools } from "lib/rxstate"
import { State } from "./index"

export const tools = createObservableStateTools<State>()

export const createDispatcher = tools.createDispatcher

export const connect = tools.connect
