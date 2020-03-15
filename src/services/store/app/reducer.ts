import { Action } from "./actions"

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
