import { store } from "services/store"
import { actionCreators as actions } from "services/store/listPage/actions"
import { firestore, dataWithId } from "services/firebase"
import { camelCase } from "change-case"
import { toPairs, fromPairs, pipe, map } from "ramda"

const camelCaseKeys = (obj: any) =>
  (pipe as any)(
    toPairs as any,
    map(([key, value]) => [camelCase(key), value]) as any,
    fromPairs as any,
  )(obj)

const parseTaskList = (taskList: RawTaskList): TaskList => {
  return {
    ...taskList,
    createdAt: new Date(taskList.createdAt),
    updatedAt: taskList.updatedAt ? new Date(taskList.updatedAt) : null,
  }
}

export const init = () => {
  console.log("initializing")

  const dispatch = store.dispatch

  firestore
    .collection("task_lists")
    .where("user_id", "==", null)
    .onSnapshot(snapshot => {
      const taskLists = snapshot.docs.map(doc =>
        parseTaskList(dataWithId(doc) as RawTaskList),
      )

      dispatch(actions.setTaskLists(taskLists))
    })
}

init()
