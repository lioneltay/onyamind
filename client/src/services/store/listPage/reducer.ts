import { assertNever } from "lib/utils"
import { Action } from "./actions"

export type State = {
  // All TaskLists of the current user
  taskLists: TaskList[] | null
  // All Tasks to display on the tasklist page
  tasks: Task[] | null
  // All Tasks to display on the trash page
  trashTasks: Task[] | null
  showDrawer: boolean
  // Current
  selectedTaskListId: ID | null
  editingTaskId: ID | null
  selectedTaskIds: ID[]
  user: User | null
}

const initialState: State = {
  taskLists: null,
  tasks: null,
  selectedTaskListId: null,
  editingTaskId: null,
  selectedTaskIds: [],
  showDrawer: false,
  trashTasks: [],
  user: null,
}

export const reducer = (state: State = initialState, action: Action): State => {
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
        taskLists: action.payload.taskLists,
      }
    }
    case "TOGGLE_TASK_SELECTION": {
      const selected = !!state.selectedTaskIds.find(
        taskId => taskId === action.taskId,
      )

      return {
        ...state,
        selectedTaskIds: selected
          ? state.selectedTaskIds.filter(id => id === action.taskId)
          : state.selectedTaskIds.concat(action.taskId),
      }
    }
    case "SELECT_ALL_TASKS": {
      return {
        ...state,
        selectedTaskIds: state.tasks?.map(task => task.id) ?? [],
      }
    }
    case "DESELECT_ALL_TASKS": {
      return {
        ...state,
        selectedTaskIds: [],
      }
    }
    case "COMPLETE_SELECTED_TASKS": {
      return {
        ...state,
        selectedTaskIds: [],
      }
    }
    case "DECOMPLETE_SELECTED_TASKS": {
      return {
        ...state,
        selectedTaskIds: [],
      }
    }
    case "SET_USER": {
      action
      return {
        ...state,
        user: action.payload.user,
      }
    }
    case "SELECT_TASK_LIST": {
      return {
        ...state,
        selectedTaskListId: action.payload.listId,
      }
    }
    default: {
      assertNever(action)
      return state
    }
  }
}
