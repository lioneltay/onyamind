import { assert } from "lib/utils"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"
import { GetState, Dispatch } from "services/store"
import { selectors as storeSelectors } from "services/store/selectors"
import * as api from "services/api"

const selectors = storeSelectors.listPage

const setMultiselect = (multiselect: boolean) =>
  ({ type: "LIST|SET_MULTISELECT", payload: { multiselect } } as const)

const selectIncompleteTasks = () =>
  ({ type: "LIST|SELECT_INCOMPLETE_TASKS" } as const)

const deselectIncompleteTasks = () =>
  ({ type: "LIST|DESELECT_INCOMPLETE_TASKS" } as const)

type SetTasksOptions = {
  tasks: Task[]
  listId: ID
}
const setTasks = ({ tasks, listId }: SetTasksOptions) =>
  ({ type: "LIST|SET_TASKS", payload: { tasks, listId } } as const)

const toggleTaskSelection = (taskId: ID) =>
  ({ type: "LIST|TOGGLE_TASK_SELECTION", payload: { taskId } } as const)

const selectAllTasks = () => ({ type: "LIST|SELECT_ALL_TASKS" } as const)

const deselectAllTasks = () => ({ type: "LIST|DESELECT_ALL_TASKS" } as const)

const setEditingTask = (taskId: ID | null) =>
  ({
    type: "LIST|SET_EDITING_TASK",
    payload: { taskId },
  } as const)

const stopEditingTask = () => ({ type: "LIST|STOP_EDITING_TASK" } as const)

const toggleEditingTask = (taskId: ID | null) =>
  ({
    type: "LIST|TOGGLE_EDITING_TASK",
    payload: { taskId },
  } as const)

const deleteSelectedTasksPending = () =>
  ({ type: "LIST|DELETE_SELECTED_TASKS|PENDING" } as const)
const deleteSelectedTasksFailure = () =>
  ({ type: "LIST|DELETE_SELECTED_TASKS|FAILURE" } as const)
const deleteSelectedTasksSuccess = () =>
  ({ type: "LIST|DELETE_SELECTED_TASKS|SUCCESS" } as const)
const deleteSelectedTasks = () => (dispatch: Dispatch, getState: GetState) => {
  const tasks = selectors.selectedTasks(getState())

  dispatch(deleteSelectedTasksPending())
  return api
    .deleteTasks(
      tasks.map((task) => ({ taskId: task.id, listId: task.listId })),
    )
    .then(() => dispatch(deleteSelectedTasksSuccess()))
    .catch((e) => {
      dispatch(deleteSelectedTasksFailure())
      throw e
    })
}

const moveSelectedTasksPending = () =>
  ({ type: "LIST|MOVE_SELECTED_TASKS|PENDING" } as const)
const moveSelectedTasksFailure = () =>
  ({ type: "LIST|MOVE_SELECTED_TASKS|FAILURE" } as const)
const moveSelectedTasksSuccess = () =>
  ({ type: "LIST|MOVE_SELECTED_TASKS|SUCCESS" } as const)
type MoveSelectTasksInput = {
  listId: ID
}
const moveSelectedTasks = ({ listId }: MoveSelectTasksInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const state = getState()

  const selectedTaskListId = state.app.selectedTaskListId
  assert(
    selectedTaskListId,
    "Cannot call moveTask without a selectedTaskListId",
  )

  const tasks = selectors.selectedTasks(state)

  dispatch(moveSelectedTasksPending())
  return api
    .editTasks(tasks.map((task) => ({ ...task, listId })))
    .then(() => dispatch(moveSelectedTasksSuccess()))
    .catch((e) => {
      dispatch(moveSelectedTasksFailure())
      throw e
    })
}

const completeSelectedTasksPending = () =>
  ({ type: "LIST|COMPLETE_SELECTED_TASKS|PENDING" } as const)
const completeSelectedTasksFailure = () =>
  ({ type: "LIST|COMPLETE_SELECTED_TASKS|FAILURE" } as const)
const completeSelectedTasksSuccess = () =>
  ({ type: "LIST|COMPLETE_SELECTED_TASKS|SUCCESS" } as const)
const completeSelectedTasks = () => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const selectedTasks = selectors.selectedTasks(getState())

  dispatch(completeSelectedTasksPending())
  return api
    .editTasks(selectedTasks.map((task) => ({ ...task, complete: true })))
    .then(() => dispatch(completeSelectedTasksSuccess()))
    .catch((e) => {
      dispatch(completeSelectedTasksFailure())
      throw e
    })
}

const deleteCompletedTasksPending = () =>
  ({ type: "LIST|DELETE_COMPLETED_TASKS|PENDING" } as const)
const deleteCompletedTasksFailure = () =>
  ({ type: "LIST|DELETE_COMPLETED_TASKS|FAILURE" } as const)
const deleteCompletedTasksSuccess = () =>
  ({ type: "LIST|DELETE_COMPLETED_TASKS|SUCCESS" } as const)
const deleteCompletedTasks = () => (dispatch: Dispatch, getState: GetState) => {
  const tasks = selectors.completedTasks(getState())

  dispatch(deleteCompletedTasksPending())
  return api
    .deleteTasks(
      tasks.map((task) => ({ taskId: task.id, listId: task.listId })),
    )
    .then(() => dispatch(deleteCompletedTasksSuccess()))
    .catch((e) => {
      dispatch(deleteCompletedTasksFailure())
      throw e
    })
}

const decompleteSelectedTasksPending = () =>
  ({ type: "LIST|DECOMPLETE_SELECTED_TASKS|PENDING" } as const)
const decompleteSelectedTasksFailure = () =>
  ({ type: "LIST|DECOMPLETE_SELECTED_TASKS|FAILURE" } as const)
const decompleteSelectedTasksSuccess = () =>
  ({ type: "LIST|DECOMPLETE_SELECTED_TASKS|SUCCESS" } as const)
const decompleteSelectedTasks = () => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const selectedTasks = selectors.selectedTasks(getState())

  dispatch(decompleteSelectedTasksPending())
  return api
    .editTasks(selectedTasks.map((task) => ({ ...task, complete: false })))
    .then(() => dispatch(decompleteSelectedTasksSuccess()))
    .catch((e) => {
      dispatch(decompleteSelectedTasksFailure())
      throw e
    })
}

const decompleteCompletedTasksPending = () =>
  ({ type: "LIST|DECOMPLETE_COMPLETED_TASKS|PENDING" } as const)
const decompleteCompletedTasksFailure = () =>
  ({ type: "LIST|DECOMPLETE_COMPLETED_TASKS|FAILURE" } as const)
const decompleteCompletedTasksSuccess = () =>
  ({ type: "LIST|DECOMPLETE_COMPLETED_TASKS|SUCCESS" } as const)
const decompleteCompletedTasks = () => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const tasks = selectors.completedTasks(getState())

  dispatch(decompleteCompletedTasksPending())
  return api
    .editTasks(tasks.map((task) => ({ ...task, complete: false })))
    .then(() => dispatch(decompleteCompletedTasksSuccess()))
    .catch((e) => {
      dispatch(decompleteCompletedTasksFailure())
      throw e
    })
}

const createTaskPending = () => ({ type: "LIST|CREATE_TASK|PENDING" } as const)
const createTaskFailure = () => ({ type: "LIST|CREATE_TASK|FAILURE" } as const)
const createTaskSuccess = () => ({ type: "LIST|CREATE_TASK|SUCCESS" } as const)
type CreateTaskInput = {
  title?: string
  notes?: string
}
const createTask = ({ title = "", notes = "" }: CreateTaskInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const state = getState()
  const listId = state.app.selectedTaskListId
  const userId = state.auth.user?.uid ?? null

  if (!listId) {
    throw Error("Cannot create task when there is no selected task list")
  }

  assert(userId, "No user")

  dispatch(createTaskPending())
  return api
    .createTask({ listId, userId, title, notes })
    .then(() => dispatch(createTaskSuccess()))
    .catch((e) => {
      dispatch(createTaskFailure())
      throw e
    })
}

type EditTaskInput = {
  taskId: ID
  title?: string
  notes?: string
  complete?: boolean
}

const editTaskPending = () => ({ type: "LIST|EDIT_TASK|PENDING" } as const)
const editTaskFailure = () => ({ type: "LIST|EDIT_TASK|FAILURE" } as const)
const editTaskSuccess = () => ({ type: "LIST|EDIT_TASK|SUCCESS" } as const)
const editTask = ({ taskId, title, notes, complete }: EditTaskInput) => (
  dispatch: Dispatch,
) => {
  dispatch(editTaskPending())
  return api
    .editTask({ taskId, data: { title, notes, complete } })
    .then(() => dispatch(editTaskSuccess()))
    .catch((e) => {
      dispatch(editTaskFailure())
      throw e
    })
}

type DeleteTaskInput = {
  taskId: ID
  listId: ID
}

const deleteTaskPending = () => ({ type: "LIST|DELETE_TASK|PENDING" } as const)
const deleteTaskFailure = () => ({ type: "LIST|DELETE_TASK|FAILURE" } as const)
const deleteTaskSuccess = () => ({ type: "LIST|DELETE_TASK|SUCCESS" } as const)
const deleteTask = ({ taskId, listId }: DeleteTaskInput) => (
  dispatch: Dispatch,
) => {
  dispatch(deleteTaskPending())
  return api
    .deleteTask({ taskId, listId })
    .then(() => dispatch(deleteTaskSuccess()))
    .catch((e) => {
      dispatch(deleteTaskFailure())
      throw e
    })
}

const checkTaskPending = () => ({ type: "LIST|CHECK_TASK|PENDING" } as const)
const checkTaskFailure = () => ({ type: "LIST|CHECK_TASK|FAILURE" } as const)
const checkTaskSuccess = () => ({ type: "LIST|CHECK_TASK|SUCCESS" } as const)
const checkTask = (taskId: ID) => (dispatch: Dispatch) => {
  dispatch(checkTaskPending())
  return api
    .checkTask(taskId)
    .then(() => dispatch(checkTaskSuccess()))
    .catch((e) => {
      dispatch(checkTaskFailure())
      throw e
    })
}

const uncheckTaskPending = () =>
  ({ type: "LIST|UNCHECK_TASK|PENDING" } as const)
const uncheckTaskFailure = () =>
  ({ type: "LIST|UNCHECK_TASK|FAILURE" } as const)
const uncheckTaskSuccess = () =>
  ({ type: "LIST|UNCHECK_TASK|SUCCESS" } as const)
const uncheckTask = (taskId: ID) => (dispatch: Dispatch) => {
  dispatch(uncheckTaskPending())
  return api
    .uncheckTask(taskId)
    .then(() => dispatch(uncheckTaskSuccess()))
    .catch((e) => {
      dispatch(uncheckTaskFailure())
      throw e
    })
}

const moveTaskPending = () => ({ type: "LIST|MOVE_TASK|PENDING" } as const)
const moveTaskFailure = () => ({ type: "LIST|MOVE_TASK|FAILURE" } as const)
const moveTaskSuccess = () => ({ type: "LIST|MOVE_TASK|SUCCESS" } as const)
type MoveTaskInput = {
  taskId: ID
  listId: ID
}
const moveTask = ({ taskId, listId }: MoveTaskInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const task = selectors.tasks(getState())?.find((t) => t.id === taskId)

  assert(task, "No task")

  dispatch(moveTaskPending())
  return api
    .editTask({ taskId: task.id, data: { listId } })
    .then(() => dispatch(moveTaskSuccess()))
    .catch((e) => {
      dispatch(moveTaskFailure())
      throw e
    })
}

export const actionCreators = {
  setMultiselect,
  setTasks,
  toggleTaskSelection,
  selectAllTasks,
  deselectAllTasks,
  setEditingTask,
  stopEditingTask,
  toggleEditingTask,
  selectIncompleteTasks,
  deselectIncompleteTasks,

  deleteSelectedTasks,
  deleteSelectedTasksPending,
  deleteSelectedTasksFailure,
  deleteSelectedTasksSuccess,

  moveSelectedTasks,
  moveSelectedTasksPending,
  moveSelectedTasksFailure,
  moveSelectedTasksSuccess,

  completeSelectedTasksPending,
  completeSelectedTasksFailure,
  completeSelectedTasksSuccess,

  decompleteCompletedTasksPending,
  decompleteCompletedTasksFailure,
  decompleteCompletedTasksSuccess,

  decompleteSelectedTasksPending,
  decompleteSelectedTasksFailure,
  decompleteSelectedTasksSuccess,

  createTaskPending,
  createTaskFailure,
  createTaskSuccess,

  editTaskPending,
  editTaskFailure,
  editTaskSuccess,

  deleteTaskPending,
  deleteTaskFailure,
  deleteTaskSuccess,

  checkTaskPending,
  checkTaskFailure,
  checkTaskSuccess,
  checkTask,

  uncheckTaskPending,
  uncheckTaskFailure,
  uncheckTaskSuccess,
  uncheckTask,

  moveTaskPending,
  moveTaskFailure,
  moveTaskSuccess,

  deleteCompletedTasksPending,
  deleteCompletedTasksFailure,
  deleteCompletedTasksSuccess,

  completeSelectedTasks,
  decompleteSelectedTasks,
  decompleteCompletedTasks,
  createTask,
  editTask,
  deleteTask,
  moveTask,
  deleteCompletedTasks,
}

export type Action = ActionsUnion<typeof actionCreators>
export type ActionType = ActionTypesUnion<typeof actionCreators>
