import { assert } from "lib/utils"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"
import { GetState, Dispatch } from "services/store"
import { selectors as storeSelectors } from "services/store/selectors"
import * as api from "services/api"
import { firestore, firebase } from "services/firebase"

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

const selectMultipleTasks = (taskIds: ID[]) =>
  ({ type: "LIST|SELECT_MULTIPLE_TASKS", payload: { taskIds } } as const)

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

const archiveSelectedTasksPending = () =>
  ({ type: "LIST|ARCHIVE_SELECTED_TASKS|PENDING" } as const)
const archiveSelectedTasksFailure = () =>
  ({ type: "LIST|ARCHIVE_SELECTED_TASKS|FAILURE" } as const)
const archiveSelectedTasksSuccess = () =>
  ({ type: "LIST|ARCHIVE_SELECTED_TASKS|SUCCESS" } as const)
const archiveSelectedTasks = () => (dispatch: Dispatch, getState: GetState) => {
  const tasks = selectors.selectedTasks(getState())

  dispatch(archiveSelectedTasksPending())
  return api
    .editTasks(tasks.map(task => ({ ...task, archived: true })))
    .then(() => dispatch(archiveSelectedTasksSuccess()))
    .catch(e => {
      dispatch(archiveSelectedTasksFailure())
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

  console.log("moveseletedt asks", tasks, listId)
  dispatch(moveSelectedTasksPending())
  return api
    .editTasks(tasks.map(task => ({ ...task, listId })))
    .then(() => dispatch(moveSelectedTasksSuccess()))
    .catch(e => {
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
    .editTasks(selectedTasks.map(task => ({ ...task, complete: true })))
    .then(() => dispatch(completeSelectedTasksSuccess()))
    .catch(e => {
      dispatch(completeSelectedTasksFailure())
      throw e
    })
}

const archiveCompletedTasksPending = () =>
  ({ type: "LIST|ARCHIVE_COMPLETED_TASKS|PENDING" } as const)
const archiveCompletedTasksFailure = () =>
  ({ type: "LIST|ARCHIVE_COMPLETED_TASKS|FAILURE" } as const)
const archiveCompletedTasksSuccess = () =>
  ({ type: "LIST|ARCHIVE_COMPLETED_TASKS|SUCCESS" } as const)
const archiveCompletedTasks = () => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const tasks = selectors.completedTasks(getState())

  dispatch(archiveCompletedTasksPending())
  return api
    .editTasks(tasks.map(task => ({ ...task, archived: true })))
    .then(() => dispatch(archiveCompletedTasksSuccess()))
    .catch(e => {
      dispatch(archiveCompletedTasksFailure())
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
    .editTasks(selectedTasks.map(task => ({ ...task, complete: false })))
    .then(() => dispatch(decompleteSelectedTasksSuccess()))
    .catch(e => {
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
    .editTasks(tasks.map(task => ({ ...task, complete: false })))
    .then(() => dispatch(decompleteCompletedTasksSuccess()))
    .catch(e => {
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
    .catch(e => {
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
    .catch(e => {
      dispatch(editTaskFailure())
      throw e
    })
}

const archiveTaskPending = () =>
  ({ type: "LIST|ARCHIVE_TASK|PENDING" } as const)
const archiveTaskFailure = () =>
  ({ type: "LIST|ARCHIVE_TASK|FAILURE" } as const)
const archiveTaskSuccess = () =>
  ({ type: "LIST|ARCHIVE_TASK|SUCCESS" } as const)
const archiveTask = (taskId: ID) => (dispatch: Dispatch) => {
  dispatch(archiveTaskPending())
  return api
    .editTask({ taskId, data: { archived: true } })
    .then(() => dispatch(archiveTaskSuccess()))
    .catch(e => {
      dispatch(archiveTaskFailure())
      throw e
    })
}

const completeTaskPending = () =>
  ({ type: "LIST|COMPLETE_TASK|PENDING" } as const)
const completeTaskFailure = () =>
  ({ type: "LIST|COMPLETE_TASK|FAILURE" } as const)
const completeTaskSuccess = () =>
  ({ type: "LIST|COMPLETE_TASK|SUCCESS" } as const)
const completeTask = (taskId: ID) => (dispatch: Dispatch) => {
  dispatch(completeTaskPending())
  return api
    .editTask({ taskId, data: { complete: true } })
    .then(() => dispatch(completeTaskSuccess()))
    .catch(e => {
      dispatch(completeTaskFailure())
      throw e
    })
}

const decompleteTaskPending = () =>
  ({ type: "LIST|DECOMPLETE_TASK|PENDING" } as const)
const decompleteTaskFailure = () =>
  ({ type: "LIST|DECOMPLETE_TASK|FAILURE" } as const)
const decompleteTaskSuccess = () =>
  ({ type: "LIST|DECOMPLETE_TASK|SUCCESS" } as const)
const decompleteTask = (taskId: ID) => (dispatch: Dispatch) => {
  dispatch(decompleteTaskPending())
  return api
    .editTask({ taskId, data: { complete: false } })
    .then(() => dispatch(decompleteTaskSuccess()))
    .catch(e => {
      dispatch(decompleteTaskFailure())
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
  const task = selectors.tasks(getState())?.find(t => t.id === taskId)

  assert(task, "No task")

  dispatch(moveTaskPending())
  return api
    .editTask({ taskId: task.id, data: { listId } })
    .then(() => dispatch(moveTaskSuccess()))
    .catch(e => {
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

  archiveSelectedTasks,
  archiveSelectedTasksPending,
  archiveSelectedTasksFailure,
  archiveSelectedTasksSuccess,

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

  archiveTaskPending,
  archiveTaskFailure,
  archiveTaskSuccess,

  completeTaskPending,
  completeTaskFailure,
  completeTaskSuccess,

  decompleteTaskPending,
  decompleteTaskFailure,
  decompleteTaskSuccess,

  moveTaskPending,
  moveTaskFailure,
  moveTaskSuccess,

  archiveCompletedTasksPending,
  archiveCompletedTasksFailure,
  archiveCompletedTasksSuccess,

  completeSelectedTasks,
  decompleteSelectedTasks,
  decompleteCompletedTasks,
  createTask,
  editTask,
  archiveTask,
  completeTask,
  decompleteTask,
  moveTask,
  archiveCompletedTasks,
}

export type Action = ActionsUnion<typeof actionCreators>
export type ActionType = ActionTypesUnion<typeof actionCreators>
