import { bindActionCreators } from "redux"
import { useDispatch } from "react-redux"

import { Task, TaskList, User } from "types"

export const SET_TASK_LISTS = "SET_TASK_LISTS"
type SetTaskListsInput = {
  taskLists: TaskList[]
}
export const setTaskLists = ({ taskLists }: SetTaskListsInput) =>
  ({
    type: SET_TASK_LISTS,
    taskLists,
  } as const)
export type SetTaskListsAction = ReturnType<typeof setTaskLists>

export const SET_TASKS = "SET_TASKS"
type SetTasksInput = {
  tasks: Task[]
}
export const setTasks = ({ tasks }: SetTasksInput) =>
  ({
    type: SET_TASKS,
    tasks,
  } as const)
export type SetTasksAction = ReturnType<typeof setTasks>

export const TOGGLE_TASK_SELECTION = "TOGGLE_TASK_SELECTION"
type ToggleTaskSelectionInput = {
  taskId: ID
}
export const toggleTaskSelection = ({ taskId }: ToggleTaskSelectionInput) =>
  ({
    type: TOGGLE_TASK_SELECTION,
    taskId,
  } as const)
export type ToggleTaskSelectionAction = ReturnType<typeof toggleTaskSelection>

export const SELECT_ALL_TASKS = "SELECT_ALL_TASKS"
export const selectAllTasks = () =>
  ({
    type: SELECT_ALL_TASKS,
  } as const)
export type SelectAllTasksAction = ReturnType<typeof selectAllTasks>

export const DESELECT_ALL_TASKS = "DESELECT_ALL_TASKS"
export const deselectAllTasks = () =>
  ({
    type: DESELECT_ALL_TASKS,
  } as const)
export type DeselectAllTasksAction = ReturnType<typeof deselectAllTasks>

export const COMPLETE_SELECTED_TASKS = "COMPLETE_SELECTED_TASKS"
export const completeSelectedTasks = () =>
  ({
    type: COMPLETE_SELECTED_TASKS,
  } as const)
export type CompleteSelectedTasksAction = ReturnType<
  typeof completeSelectedTasks
>

export const DECOMPLETE_SELECTED_TASKS = "DECOMPLETE_SELECTED_TASKS"
export const decompleteSelectedTasks = () =>
  ({
    type: DECOMPLETE_SELECTED_TASKS,
  } as const)
export type DecompleteSelectedTasksAction = ReturnType<
  typeof decompleteSelectedTasks
>

export const DECOMPLETE_COMPLETED_TASKS = "DECOMPLETE_COMPLETED_TASKS"
export const decompleteCompletedTasks = () =>
  ({
    type: DECOMPLETE_COMPLETED_TASKS,
  } as const)
export type DecompleteCompletedTasksAction = ReturnType<
  typeof decompleteCompletedTasks
>

export const DELETE_COMPLETED_TASKS = "DELETE_COMPLETED_TASKS"
export const deleteCompletedTasks = () =>
  ({
    type: DELETE_COMPLETED_TASKS,
  } as const)
export type DeleteCompletedTasksAction = ReturnType<typeof deleteCompletedTasks>

type CreateTaskInput = {
  title?: string
  notes?: string
}
export const createTask = ({ title, notes }: CreateTaskInput) =>
  ({
    type: "CREATE_TASK",
    title,
    notes,
  } as const)
export type CreateTaskAction = ReturnType<typeof createTask>

type EditTaskInput = {
  taskId: ID
  title?: string
  notes?: string
}
export const editTask = ({ taskId, title, notes }: EditTaskInput) =>
  ({
    type: "EDIT_TASK",
    taskId,
    title,
    notes,
  } as const)
export type EditTaskAction = ReturnType<typeof editTask>

type DeleteTaskInput = {
  taskId: ID
}
export const deleteTask = ({ taskId }: DeleteTaskInput) =>
  ({
    type: "DELETE_TASK",
    taskId,
  } as const)
export type DeleteTaskAction = ReturnType<typeof deleteTask>

type ArchiveTaskInput = {
  taskId: ID
}
export const archiveTask = ({ taskId }: ArchiveTaskInput) =>
  ({
    type: "ARCHIVE_TASK_ACTION",
    taskId,
  } as const)
export type ArchiveTaskAction = ReturnType<typeof archiveTask>

type UnarchiveTaskInput = {
  taskId: ID
}
export const unarchiveTask = ({ taskId }: UnarchiveTaskInput) =>
  ({
    type: "UNARCHIVE_TASK_ACTION",
    taskId,
  } as const)
export type UnarchiveTaskAction = ReturnType<typeof unarchiveTask>

export const emptyTrash = () =>
  ({
    type: "EMPTY_TRASH",
  } as const)
export type EmptyTrashAction = ReturnType<typeof emptyTrash>

type CompleteTaskInput = {
  taskId: ID
}
export const completeTask = ({ taskId }: CompleteTaskInput) =>
  ({
    type: "COMPLETE_TASK",
    taskId,
  } as const)
export type CompleteTaskAction = ReturnType<typeof completeTask>

type DecompleteTaskInput = {
  taskId: ID
}
export const decompleteTask = ({ taskId }: DecompleteTaskInput) =>
  ({
    type: "DECOMPLETE_TASK",
    taskId,
  } as const)
export type DecompleteTaskAction = ReturnType<typeof decompleteTask>

type MoveTaskInput = {
  taskId: ID
  listId: ID
}
export const moveTask = ({ taskId, listId }: MoveTaskInput) =>
  ({
    type: "MOVE_TASK",
    taskId,
    listId,
  } as const)
export type MoveTaskAction = ReturnType<typeof moveTask>

type CreateTaskListInput = {
  taskListId: ID
  name: string
  primary?: boolean
}
export const createTaskList = ({
  taskListId,
  name,
  primary,
}: CreateTaskListInput) =>
  ({
    type: "CREATE_TASK_LIST",
    taskListId,
    name,
    primary,
  } as const)
export type CreateTaskListAction = ReturnType<typeof createTaskList>

type EditTaskListInput = {
  taskListId: ID
  name: string
  primary?: boolean
}
export const editTaskList = ({
  taskListId,
  name,
  primary,
}: EditTaskListInput) =>
  ({
    type: "EDIT_TASK_LIST",
    taskListId,
    name,
    primary,
  } as const)
export type EditTaskListAction = ReturnType<typeof editTaskList>

type DeleteTaskListInput = {
  taskListId: ID
}
export const deleteTaskList = ({ taskListId }: DeleteTaskListInput) =>
  ({
    type: "DELETE_TASK_LIST",
    taskListId,
  } as const)
export type DeleteTaskListAction = ReturnType<typeof deleteTaskList>

type SetUserInput = {
  user: User
}
export const setUser = ({ user }: SetUserInput) =>
  ({
    type: "SET_USER",
    user,
  } as const)
export type SetUserAction = ReturnType<typeof setUser>

export type Action =
  | SetTaskListsAction
  | SetTasksAction
  //
  | ToggleTaskSelectionAction
  | SelectAllTasksAction
  | DeselectAllTasksAction
  //
  | CompleteSelectedTasksAction
  | DecompleteSelectedTasksAction
  //
  | DecompleteCompletedTasksAction
  | DeleteCompletedTasksAction
  //
  | CreateTaskAction
  | EditTaskAction
  | DeleteTaskAction
  | ArchiveTaskAction
  | UnarchiveTaskAction
  | EmptyTrashAction
  | CompleteTaskAction
  | DecompleteTaskAction
  | MoveTaskAction
  //
  | CreateTaskListAction
  | EditTaskListAction
  | DeleteTaskListAction
  //
  | SetUserAction

export const actionCreators = {
  toggleTaskSelection,
  setTaskLists,
  setTasks,
}

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
}
