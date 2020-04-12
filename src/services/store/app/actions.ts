import { assert } from "lib/utils"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"
import { GetState, Dispatch } from "services/store"
import * as api from "services/api"

const setTaskLists = (taskLists: TaskList[]) =>
  ({ type: "APP|SET_TASK_LISTS", payload: { taskLists } } as const)

const selectTaskList = (listId: ID | null) =>
  ({
    type: "APP|SELECT_TASK_LIST",
    payload: { listId },
  } as const)

const createTaskListPending = () =>
  ({ type: "APP|CREATE_TASK_DATA|PENDING" } as const)
const createTaskListFailure = () =>
  ({ type: "APP|CREATE_TASK_DATA|FAILURE" } as const)
const createTaskListSuccess = () =>
  ({ type: "APP|CREATE_TASK_DATA|SUCCESS" } as const)
type CreateTaskListInput = {
  name: string
  primary?: boolean
}
const createTaskList = ({ primary = true, name }: CreateTaskListInput) => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const userId = getState().auth.user?.uid
  assert(userId, "No userId")

  dispatch(createTaskListPending())
  return api
    .createTaskList({ userId, primary, name })
    .then(() => dispatch(createTaskListSuccess()))
    .catch((e) => {
      dispatch(createTaskListFailure())
      throw e
    })
}

const editTaskListPending = () =>
  ({ type: "APP|EDIT_TASK_DATA|PENDING" } as const)
const editTaskListFailure = () =>
  ({ type: "APP|EDIT_TASK_DATA|FAILURE" } as const)
const editTaskListSuccess = () =>
  ({ type: "APP|EDIT_TASK_DATA|SUCCESS" } as const)
type EditTaskListInput = {
  listId: ID
  data: {
    name: string
    primary?: boolean
  }
}
const editTaskList = ({
  data: { name, primary },
  listId,
}: EditTaskListInput) => (dispatch: Dispatch) => {
  dispatch(editTaskListPending())
  return api
    .editTaskList({ listId, data: { name, primary } })
    .then(() => dispatch(editTaskListSuccess()))
    .catch((e) => {
      dispatch(editTaskListFailure())
      throw e
    })
}

const setPrimaryTaskListPending = () =>
  ({ type: "APP|SET_PRIMARY_TASK_DATA|PENDING" } as const)
const setPrimaryTaskListFailure = () =>
  ({ type: "APP|SET_PRIMARY_TASK_DATA|FAILURE" } as const)
const setPrimaryTaskListSuccess = () =>
  ({ type: "APP|SET_PRIMARY_TASK_DATA|SUCCESS" } as const)
type SetPrimaryTaskListInput = {
  listId: ID
  userId: ID
}
const setPrimaryTaskList = ({ listId, userId }: SetPrimaryTaskListInput) => (
  dispatch: Dispatch,
) => {
  dispatch(setPrimaryTaskListPending())
  return api
    .setPrimaryTaskList({ listId, userId })
    .then(() => dispatch(setPrimaryTaskListSuccess()))
    .catch((e) => {
      dispatch(setPrimaryTaskListFailure())
      throw e
    })
}

const deleteTaskListPending = () =>
  ({ type: "APP|DELETE_TASK_DATA|PENDING" } as const)
const deleteTaskListFailure = () =>
  ({ type: "APP|DELETE_TASK_DATA|FAILURE" } as const)
const deleteTaskListSuccess = () =>
  ({ type: "APP|DELETE_TASK_DATA|SUCCESS" } as const)
const deleteTaskList = (listId: ID) => (dispatch: Dispatch) => {
  dispatch(deleteTaskListPending())
  return api
    .deleteTaskList(listId)
    .then(() => dispatch(deleteTaskListSuccess()))
    .catch((e) => {
      dispatch(deleteTaskListFailure())
      throw e
    })
}

const selectPrimaryTaskList = () => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const { taskLists } = getState().app
  assert(taskLists, "Task lists havent loaded yet")
  const primaryList = taskLists.find((list) => list.primary)

  const listId = primaryList?.id ?? taskLists[0].id

  assert(taskLists.length > 0, "User has no TaskLists")

  dispatch(selectTaskList(listId))
}

export const actionCreators = {
  selectPrimaryTaskList,
  setTaskLists,
  selectTaskList,

  createTaskList,
  createTaskListPending,
  createTaskListFailure,
  createTaskListSuccess,

  editTaskList,
  editTaskListPending,
  editTaskListFailure,
  editTaskListSuccess,

  deleteTaskList,
  deleteTaskListPending,
  deleteTaskListFailure,
  deleteTaskListSuccess,

  setPrimaryTaskList,
  setPrimaryTaskListPending,
  setPrimaryTaskListFailure,
  setPrimaryTaskListSuccess,
}

export type Action = ActionsUnion<typeof actionCreators>
export type ActionType = ActionTypesUnion<typeof actionCreators>
