import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"
import { GetState, Dispatch } from "services/store"
import { selectors as storeSelectors } from "services/store/selectors"
import * as api from "services/api"
import { firestore, firebase } from "services/firebase"

const selectors = storeSelectors.trashPage

const setMultiselect = (multiselect: boolean) =>
  ({ type: "TRASH|SET_MULTISELECT", payload: { multiselect } } as const)

const setTrashTasks = (tasks: Task[]) =>
  ({ type: "TRASH|SET_TRASH_TASKS", payload: { tasks } } as const)

const toggleTaskSelection = (taskId: ID) =>
  ({ type: "TRASH|TOGGLE_TASK_SELECTION", taskId } as const)

const selectAllTasks = () => ({ type: "TRASH|SELECT_ALL_TASKS" } as const)

const deselectAllTasks = () => ({ type: "TRASH|DESELECT_ALL_TASKS" } as const)

const moveSelectedTasksPending = () =>
  ({ type: "TRASH|MOVE_SELECTED_TASKS|PENDING" } as const)
const moveSelectedTasksFailure = () =>
  ({ type: "TRASH|MOVE_SELECTED_TASKS|FAILURE" } as const)
const moveSelectedTasksSuccess = () =>
  ({ type: "TRASH|MOVE_SELECTED_TASKS|SUCCESS" } as const)
type MoveSelectTasksInput = {
  listId: ID
}
const moveSelectedTasks = ({ listId }: MoveSelectTasksInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const state = getState()

  const tasks = state.trashPage.trashTasks || []
  const numberOfCompleteTasks = tasks.filter(task => task.complete).length
  const numberOfIncompleteTasks = tasks.filter(task => !task.complete).length

  const batch = firestore.batch()

  tasks.forEach(task =>
    batch.update(firestore.collection("task").doc(task.id), {
      listId: listId,
      archived: false,
    }),
  )
  batch.update(firestore.collection("taskList").doc(listId), {
    numberOfCompleteTasks: firebase.firestore.FieldValue.increment(
      numberOfCompleteTasks,
    ),
    numberOfIncompleteTasks: firebase.firestore.FieldValue.increment(
      numberOfIncompleteTasks,
    ),
  })

  dispatch(moveSelectedTasksPending())
  return batch
    .commit()
    .then(() => dispatch(moveSelectedTasksSuccess()))
    .catch(e => {
      dispatch(moveSelectedTasksFailure())
      throw e
    })
}

const deleteTaskPending = () => ({ type: "TRASH|DELETE_TASK|PENDING" } as const)
const deleteTaskFailure = () => ({ type: "TRASH|DELETE_TASK|FAILURE" } as const)
const deleteTaskSuccess = () => ({ type: "TRASH|DELETE_TASK|SUCCESS" } as const)
const deleteTask = (taskId: ID) => (dispatch: Dispatch) => {
  dispatch(deleteTaskPending())
  return api
    .deleteTask(taskId)
    .then(() => dispatch(deleteTaskSuccess()))
    .catch(e => {
      dispatch(deleteTaskFailure())
      throw e
    })
}

const unarchiveTaskPending = () =>
  ({ type: "TRASH|UNARCHIVE_TASK|PENDING" } as const)
const unarchiveTaskFailure = () =>
  ({ type: "TRASH|UNARCHIVE_TASK|FAILURE" } as const)
const unarchiveTaskSuccess = () =>
  ({ type: "TRASH|UNARCHIVE_TASK|SUCCESS" } as const)
const unarchiveTask = (taskId: ID) => (dispatch: Dispatch) => {
  dispatch(unarchiveTaskPending())
  return api
    .editTask({ taskId, data: { archived: false } })
    .then(() => dispatch(unarchiveTaskSuccess()))
    .catch(e => {
      dispatch(unarchiveTaskFailure())
      throw e
    })
}

const emptyTrashPending = () => ({ type: "TRASH|EMPTY_TRASH|PENDING" } as const)
const emptyTrashFailure = () => ({ type: "TRASH|EMPTY_TRASH|FAILURE" } as const)
const emptyTrashSuccess = () => ({ type: "TRASH|EMPTY_TRASH|SUCCESS" } as const)
const emptyTrash = () => (dispatch: Dispatch, getState: GetState) => {
  const tasks = selectors.trashTasks(getState())

  dispatch(emptyTrashPending())
  return api
    .deleteTasks(tasks.map(task => task.id))
    .then(() => dispatch(emptyTrashSuccess()))
    .catch(e => {
      dispatch(emptyTrashFailure())
      throw e
    })
}

const moveTaskPending = () => ({ type: "TRASH|MOVE_TASK|PENDING" } as const)
const moveTaskFailure = () => ({ type: "TRASH|MOVE_TASK|FAILURE" } as const)
const moveTaskSuccess = () => ({ type: "TRASH|MOVE_TASK|SUCCESS" } as const)
type MoveTaskInput = {
  taskId: ID
  listId: ID
}
const moveTask = ({ taskId, listId }: MoveTaskInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const state = getState()

  const task = state.trashPage.trashTasks?.find(t => t.id === taskId)

  if (!task) {
    throw Error("No task")
  }

  const batch = firestore.batch()

  batch.update(firestore.collection("task").doc(taskId), {
    listId: listId,
    archived: false,
  })
  batch.update(firestore.collection("taskList").doc(listId), {
    [task.complete
      ? "numberOfCompleteTasks"
      : "numberOfIncompleteTasks"]: firebase.firestore.FieldValue.increment(1),
  })

  dispatch(moveTaskPending())
  return batch
    .commit()
    .then(() => dispatch(moveTaskSuccess()))
    .catch(e => {
      dispatch(moveTaskFailure())
      throw e
    })
}

const deleteSelectedTasksPending = () =>
  ({ type: "TRASH|DELETE_SELECTED_TASKS|PENDING" } as const)
const deleteSelectedTasksFailure = () =>
  ({ type: "TRASH|DELETE_SELECTED_TASKS|FAILURE" } as const)
const deleteSelectedTasksSuccess = () =>
  ({ type: "TRASH|DELETE_SELECTED_TASKS|SUCCESS" } as const)
const deleteSelectedTasks = () => (dispatch: Dispatch, getState: GetState) => {
  const selectedTaskIds = selectors.selectedTaskIds(getState())

  dispatch(deleteSelectedTasksPending())
  return api
    .deleteTasks(selectedTaskIds)
    .then(() => dispatch(deleteSelectedTasksSuccess()))
    .catch(e => {
      dispatch(deleteSelectedTasksFailure())
      throw e
    })
}

export const actionCreators = {
  setTrashTasks,
  setMultiselect,
  toggleTaskSelection,
  selectAllTasks,
  deselectAllTasks,

  moveSelectedTasks,
  moveSelectedTasksPending,
  moveSelectedTasksFailure,
  moveSelectedTasksSuccess,

  deleteSelectedTasks,
  deleteSelectedTasksPending,
  deleteSelectedTasksFailure,
  deleteSelectedTasksSuccess,

  unarchiveTask,
  unarchiveTaskPending,
  unarchiveTaskFailure,
  unarchiveTaskSuccess,

  emptyTrash,
  emptyTrashPending,
  emptyTrashFailure,
  emptyTrashSuccess,

  moveTask,
  moveTaskPending,
  moveTaskFailure,
  moveTaskSuccess,

  deleteTask,
  deleteTaskPending,
  deleteTaskFailure,
  deleteTaskSuccess,
}

export type Action = ActionsUnion<typeof actionCreators>
export type ActionType = ActionTypesUnion<typeof actionCreators>
