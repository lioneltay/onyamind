import { combineEpics, ofType } from "redux-observable"
import { Observable, empty, of, from } from "rxjs"
import {
  map,
  switchMap,
  distinctUntilChanged,
  mergeMap,
  withLatestFrom,
  debounceTime,
  tap,
} from "rxjs/operators"
import { Action, actionCreators } from "../actions"
import { firestore, dataWithId } from "services/firebase"
import { assert } from "lib/utils"

import { selectors } from "services/store/selectors"

import { State } from "services/store"

import { StateObservable } from "redux-observable"

import * as api from "services/api"
import { router } from "services/router"
import { listPageUrl } from "pages/lists/routing"

const createTaskListObservable = (userId: ID) =>
  new Observable<TaskList[]>(observer => {
    return firestore
      .collection("taskList")
      .where("userId", "==", userId)
      .onSnapshot(snapshot => {
        const taskLists = snapshot.docs.map(doc => dataWithId(doc) as TaskList)
        observer.next(taskLists)
      })
  })

const createTasksObservable = (userId: ID, listId: ID) =>
  new Observable<Task[]>(observer => {
    return firestore
      .collection("task")
      .where("listId", "==", listId)
      .where("userId", "==", userId)
      .where("archived", "==", false)
      .onSnapshot(snapshot => {
        const tasks = snapshot.docs.map(doc => dataWithId(doc) as Task)
        observer.next(tasks)
      })
  })

const createTrashTasksObservable = (userId: ID) =>
  new Observable<Task[]>(observer => {
    return firestore
      .collection("task")
      .where("userId", "==", userId)
      .where("archived", "==", true)
      .onSnapshot(snapshot => {
        const tasks = snapshot.docs.map(doc => dataWithId(doc) as Task)
        observer.next(tasks)
      })
  })

const taskListsEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => state.auth?.user?.uid ?? null),
    distinctUntilChanged(),
    switchMap(userId => (userId ? createTaskListObservable(userId) : empty())),
    map(taskLists => actionCreators.setTaskLists(taskLists)),
  )
}

const tasksEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => [
      state.auth?.user?.uid ?? null,
      state.listPage.selectedTaskListId,
    ]),
    distinctUntilChanged(
      (prev, curr) => prev[0] === curr[0] && prev[1] === curr[1],
    ),
    switchMap(([userId, listId]) => {
      return listId && userId
        ? createTasksObservable(userId, listId).pipe(
            map(tasks => ({ tasks, listId })),
          )
        : empty()
    }),
    map(({ tasks, listId }) => actionCreators.setTasks({ tasks, listId })),
  )
}

const trashTasksEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => state.auth?.user?.uid ?? null),
    distinctUntilChanged(),
    switchMap(userId =>
      userId ? createTrashTasksObservable(userId) : empty(),
    ),
    map(tasks => actionCreators.setTrashTasks(tasks)),
  )
}

const updateTaskListCountsEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(
    ofType("SET_TASKS"),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      assert(action.type === "SET_TASKS")

      const list = state.listPage.taskLists?.find(
        list => list.id === action.payload.listId,
      )

      if (!list) {
        console.log("no task list")
        return empty()
      }

      const tasks = selectors.listPage.tasks(state, list.id)
      assert(tasks)
      const numberOfCompleteTasks = tasks.filter(task => task.complete).length
      const numberOfIncompleteTasks = tasks.filter(task => !task.complete)
        .length

      if (
        list.numberOfCompleteTasks === numberOfCompleteTasks &&
        list.numberOfIncompleteTasks === numberOfIncompleteTasks
      ) {
        return empty()
      }

      return from(
        api.editTaskList({
          listId: action.payload.listId,
          data: {
            numberOfCompleteTasks,
            numberOfIncompleteTasks,
          },
        }),
      )
    }),
    mergeMap(() => empty()),
  )
}

const firstTaskListEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(
    ofType("SET_TASK_LISTS"),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      assert(action.type === "SET_TASK_LISTS")

      const userId = state.auth.user?.uid

      console.log("firstasklist epic", userId)

      if (!(userId && action.payload.taskLists.length === 0)) {
        return empty()
      }

      return from(
        api
          .createTaskList({
            name: "Todo",
            primary: true,
            userId,
          })
          .then(async list => {
            await Promise.all([
              api.createTask({
                title: "My first task!",
                userId,
                listId: list.id,
              }),
              api.createTask({
                title: "My second task!",
                userId,
                listId: list.id,
              }),
            ])
            return list
          }),
      )
    }),
    map(list => actionCreators.selectTaskList(list.id)),
  )
}

const listPageUrlSyncEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => {
      const selectedId = state.listPage.selectedTaskListId
      return state.listPage.taskLists?.find(list => list.id === selectedId)
        ? selectedId
        : null
    }),
    distinctUntilChanged(),
    tap(listId => {
      if (listId) {
        console.log("REDIREDFJ", listId)
        router.history.push(listPageUrl(listId))
      }
    }),
    mergeMap(() => empty()),
  )
}

export const rootEpic = combineEpics(
  taskListsEpic,
  tasksEpic,
  trashTasksEpic,
  updateTaskListCountsEpic,
  firstTaskListEpic,
  listPageUrlSyncEpic,
)
