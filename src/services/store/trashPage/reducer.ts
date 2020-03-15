import { Action } from "./actions"

type UIState = {
  selectedTaskIds: ID[]
  multiselect: boolean
}

export type State = UIState & {
  // All Tasks to display on the trash page
  trashTasks: Task[] | null
}

const initialUIState: UIState = {
  selectedTaskIds: [],
  multiselect: false,
}

const initialState: State = {
  trashTasks: null,
  ...initialUIState,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "TRASH|SET_MULTISELECT": {
      return {
        ...state,
        multiselect: action.payload.multiselect,
        selectedTaskIds: action.payload.multiselect
          ? state.selectedTaskIds
          : [],
      }
    }
    case "TRASH|SET_TRASH_TASKS": {
      return {
        ...state,
        trashTasks: action.payload.tasks,
      }
    }
    case "TRASH|TOGGLE_TASK_SELECTION": {
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
    case "TRASH|SELECT_ALL_TASKS": {
      return {
        ...state,
        selectedTaskIds: state.trashTasks?.map(task => task.id) ?? [],
      }
    }
    case "TRASH|DESELECT_ALL_TASKS": {
      return {
        ...state,
        selectedTaskIds: [],
      }
    }
    case "TRASH|DELETE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "TRASH|MOVE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    default: {
      return state
    }
  }
}
