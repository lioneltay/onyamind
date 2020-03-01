import { assertNever } from "lib/utils"
import { Action } from "./actions"

import { TaskList, Task } from "types"

export type State = {
  taskLists: TaskList[] | null
  tasks: Task[] | null
  trashTasks: Task[] | null
  showDrawer: boolean
  selectedTaskListId: ID | null
  editingTaskId: ID | null
  selectedTaskIds: ID[]
  user: User | null
}

const initialState: State = {
  taskLists: null,
  tasks: null,
  selectedTaskListID: null,
  editingTaskId: null,
  selectedTaskIds: [],
  selectedTaskListId: null,
  showDrawer: false,
  trashTasks: [],
  user: null,
}

export const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_TASKS": {
      return {
        ...state,
        tasks: action.tasks,
      }
    }
    case "SET_TASK_LISTS": {
      return {
        ...state,
        taskLists: action.taskLists,
      }
    }
    default: {
      assertNever(action)
      return state
    }
  }
}
