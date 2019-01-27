import { Subject } from "rxjs"
import { createObservableStateTools } from "lib/rxstate"
import { State } from "./index"

export const tools = createObservableStateTools<State>()

export const state_s = tools.state_s

export const createDispatcher = tools.createDispatcher

export const connect = tools.connect
