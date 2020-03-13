import { assertNever } from "lib/utils"
import { Action } from "./actions"
import { union } from "ramda"

type UIState = {
  selectedTaskListId: ID | null
  editingTaskId: ID | null
  selectedTaskIds: ID[]
  multiselect: boolean
}

export type State = UIState & {
  // All TaskLists of the current user
  taskLists: TaskList[] | null
  // All Tasks to display on the tasklist page
  tasks: Task[] | null
  // All Tasks to display on the trash page
  trashTasks: Task[] | null
}

const initialUIState: UIState = {
  selectedTaskListId: null,
  editingTaskId: null,
  selectedTaskIds: [],
  multiselect: false,
}

const initialState: State = {
  taskLists: null,
  tasks: null,
  trashTasks: null,
  ...initialUIState,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_MULTISELECT": {
      return {
        ...state,
        multiselect: action.payload.multiselect,
      }
    }
    case "SET_TASKS": {
      return {
        ...state,
        tasks: action.payload.tasks,
      }
    }
    case "SET_TRASH_TASKS": {
      return {
        ...state,
        trashTasks: action.payload.tasks,
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

      const selectedTaskIds = selected
        ? state.selectedTaskIds.filter(id => id !== action.taskId)
        : state.selectedTaskIds.concat(action.taskId)

      return {
        ...state,
        selectedTaskIds,
        multiselect: selectedTaskIds.length === 0 ? false : state.multiselect,
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
    case "DELETE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "MOVE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "COMPLETE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "DECOMPLETE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "SELECT_TASK_LIST": {
      return {
        ...state,
        ...initialUIState,
        tasks: null,
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
    case "SELECT_INCOMPLETE_TASKS": {
      const incompleteTaskIds =
        state.tasks?.filter(task => !task.complete).map(task => task.id) ?? []
      return {
        ...state,
        selectedTaskIds: union(state.selectedTaskIds, incompleteTaskIds),
      }
    }
    case "DESELECT_INCOMPLETE_TASKS": {
      const incompleteTaskIds =
        state.tasks?.filter(task => !task.complete).map(task => task.id) ?? []
      return {
        ...state,
        selectedTaskIds: state.selectedTaskIds.filter(
          id => !incompleteTaskIds.includes(id),
        ),
      }
    }
    default: {
      // assertNever(action)
      return state
    }
  }
}
