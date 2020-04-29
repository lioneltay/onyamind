import { Action } from "services/store/actions"
import { union } from "ramda"
import * as selectors from "./selectors"

type UIState = {
  editingTaskId: ID | null
  selectedTaskIds: ID[]
  multiselect: boolean
}

export type State = UIState & {
  // Tasks currently being showed on list page
  tasks: Task[] | null
  // A cache for optimisation
  tasksByListId: Record<ID, Task[] | undefined>
}

const initialUIState: UIState = {
  editingTaskId: null,
  selectedTaskIds: [],
  multiselect: false,
}

const initialState: State = {
  tasks: null,
  tasksByListId: {},
  ...initialUIState,
}

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "APP|SELECT_TASK_LIST": {
      const { listId } = action.payload

      return {
        ...state,
        tasks: listId ? state.tasksByListId[listId] ?? null : null,
      }
    }
    case "LIST|SET_MULTISELECT": {
      if (action.payload.multiselect === state.multiselect) {
        return state
      }

      return {
        ...state,
        multiselect: action.payload.multiselect,
        selectedTaskIds: action.payload.multiselect
          ? state.selectedTaskIds
          : [],
      }
    }
    case "LIST|SET_TASKS": {
      return {
        ...state,
        tasks: action.payload.tasks,
        tasksByListId: {
          ...state.tasksByListId,
          [action.payload.listId]: action.payload.tasks,
        },
      }
    }
    case "LIST|TOGGLE_TASK_SELECTION": {
      const selected = !!state.selectedTaskIds.find(
        (taskId) => taskId === action.payload.taskId,
      )

      const selectedTaskIds = selected
        ? state.selectedTaskIds.filter((id) => id !== action.payload.taskId)
        : state.selectedTaskIds.concat(action.payload.taskId)

      return {
        ...state,
        selectedTaskIds,
        multiselect: selectedTaskIds.length === 0 ? false : state.multiselect,
      }
    }
    case "LIST|SELECT_ALL_TASKS": {
      return {
        ...state,
        selectedTaskIds: state.tasks?.map((task) => task.id) ?? [],
      }
    }
    case "LIST|DESELECT_ALL_TASKS": {
      return {
        ...state,
        selectedTaskIds: [],
      }
    }
    case "LIST|DELETE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "LIST|MOVE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "LIST|COMPLETE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "LIST|DECOMPLETE_SELECTED_TASKS|PENDING": {
      return {
        ...state,
        selectedTaskIds: [],
        multiselect: false,
      }
    }
    case "LIST|STOP_EDITING_TASK": {
      return {
        ...state,
        editingTaskId: null,
      }
    }
    case "LIST|SET_EDITING_TASK": {
      return {
        ...state,
        editingTaskId: action.payload.taskId,
      }
    }
    case "LIST|TOGGLE_EDITING_TASK": {
      return {
        ...state,
        editingTaskId:
          state.editingTaskId === action.payload.taskId
            ? null
            : action.payload.taskId,
      }
    }
    case "LIST|SELECT_INCOMPLETE_TASKS": {
      const incompleteTaskIds =
        state.tasks?.filter((task) => !task.complete).map((task) => task.id) ??
        []
      return {
        ...state,
        selectedTaskIds: union(state.selectedTaskIds, incompleteTaskIds),
      }
    }
    case "LIST|DESELECT_INCOMPLETE_TASKS": {
      const incompleteTaskIds =
        state.tasks?.filter((task) => !task.complete).map((task) => task.id) ??
        []
      return {
        ...state,
        selectedTaskIds: state.selectedTaskIds.filter(
          (id) => !incompleteTaskIds.includes(id),
        ),
      }
    }
    default: {
      return state
    }
  }
}
