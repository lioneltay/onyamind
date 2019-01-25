import { createReducer, createDispatcher } from "lib/rxstate"
import { State } from "services/state"

import * as api from "./api"

export const addTask = createDispatcher(api.addTask)

export const removeTask = createDispatcher(api.removeTask)

export const editTask = createDispatcher(api.editTask)

export const reducer_s = createReducer<State>([])
