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
      const { taskLists } = action.payload

      const newState = {
        ...state,
        taskLists,
      }

      if (!state.selectedTaskListId) {
        const selectedTaskList =
          taskLists.find(list => list.primary) ?? taskLists[0]
        newState.selectedTaskListId = selectedTaskList?.id
      }

      return newState
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
    case "COMPLETE_SELECTED_TASKS|PENDING": {
      return state
    }
    case "COMPLETE_SELECTED_TASKS|FAILURE": {
      return state
    }
    case "COMPLETE_SELECTED_TASKS|SUCCESS": {
      return {
        ...state,
        selectedTaskIds: [],
      }
    }
    case "DECOMPLETE_SELECTED_TASKS|PENDING": {
      return state
    }
    case "DECOMPLETE_SELECTED_TASKS|FAILURE": {
      return state
    }
    case "DECOMPLETE_SELECTED_TASKS|SUCCESS": {
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
    case "STOP_EDITING_TASK": {
      return {
        ...state,
        editingTaskId: null,
      }
    }
    case "SET_EDITING_TASK": {
      return {
        ...state,
        editingTaskId: action.payload.taskId,
      }
    }
    case "TOGGLE_EDITING_TASK": {
      return {
        ...state,
        editingTaskId:
          state.editingTaskId === action.payload.taskId
            ? null
            : action.payload.taskId,
      }
    }
    default: {
      assertNever(action)
      return state
    }
  }
}