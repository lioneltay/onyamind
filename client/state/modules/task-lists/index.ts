import { createReducer } from "lib/rxstate"
import { createDispatcher } from "services/state"

import * as api from "services/api"

export type State = TaskList[] | null

export const initial_state = null

export const addTaskList = createDispatcher(
  ({ name, primary }: { name: string; primary: boolean }) => async state => {
    const list = await api.addTaskList({
      name,
      primary,
      user_id: state.user ? state.user.uid : null,
    })

    if (list.primary) {
      await api.setPrimaryTaskList({
        user_id: list.user_id,
        task_list_id: list.id,
      })
    }

    return list
  },
)

export const deleteTaskList = createDispatcher(api.deleteTaskList)

export const editTaskList = createDispatcher(api.editTaskList)

export const createDefaultTaskList = createDispatcher(() => state =>
  api.createDefaultTaskList(state.user ? state.user.uid : null),
)

export const getTaskLists = createDispatcher(api.getTaskLists)

export const setPrimaryTaskList = createDispatcher(
  (task_list_id: ID) => state =>
    api.setPrimaryTaskList({
      user_id: state.user ? state.user.uid : null,
      task_list_id,
    }),
)

export const reducer_s = createReducer<State>()
