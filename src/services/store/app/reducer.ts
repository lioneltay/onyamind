import { Action } from "./actions"
import { move, update } from "ramda"

export type State = {
  // All TaskLists of the current user
  taskLists: TaskList[] | null
  selectedTaskListId: ID | null
}

const initialState: State = {
  taskLists: null,
  selectedTaskListId: null,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "REORDER_TASKS": {
      const lists = state.taskLists ?? []

      const { fromTaskId, listId, taskOrder, toTaskId } = action.payload

      if (lists.length === 0) {
        return state
      }

      const index = lists.findIndex((list) => list.id === listId)

      if (index < 0) {
        return state
      }

      const list = lists[index]
      const fromIndex = taskOrder.indexOf(fromTaskId)
      const toIndex = taskOrder.indexOf(toTaskId)

      if (fromIndex < 0 || toIndex < 0) {
        throw Error("Invalid arguments")
      }

      return {
        ...state,
        taskLists: update(
          index,
          {
            ...list,
            taskOrder: move(fromIndex, toIndex, taskOrder),
          },
          lists,
        ),
      }
    }
    case "APP|SELECT_TASK_LIST": {
      return {
        ...state,
        selectedTaskListId: action.payload.listId,
      }
    }
    case "APP|SET_TASK_LISTS": {
      return {
        ...state,
        taskLists: action.payload.taskLists,
      }
    }
    default: {
      return state
    }
  }
}
