import { combineEpics, ofType } from "redux-observable"
import { Observable, empty, of, from } from "rxjs"
import {
  map,
  switchMap,
  distinctUntilChanged,
  mergeMap,
  withLatestFrom,
  debounceTime,
} from "rxjs/operators"
import { Action, actionCreators } from "../actions"
import { firestore, dataWithId } from "services/firebase"
import { assert } from "lib/utils"

import { selectors } from "services/store/selectors"

import { State } from "services/store"

import { StateObservable } from "redux-observable"

import * as api from "services/api"

const createTaskListObservable = (userId: ID | null) =>
  new Observable<TaskList[]>(observer => {
    return firestore
      .collection("taskList")
      .where("userId", "==", userId)
      .onSnapshot(snapshot => {
        const taskLists = snapshot.docs.map(doc => dataWithId(doc) as TaskList)
        observer.next(taskLists)
      })
  })

const createTasksObservable = (userId: ID | null, listId: ID) =>
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

const createTrashTasksObservable = (userId: ID | null) =>
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
    switchMap(userId => createTaskListObservable(userId)),
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
    switchMap(([userId, listId]) =>
      listId
        ? createTasksObservable(userId, listId).pipe(
            map(tasks => ({ tasks, listId })),
          )
        : empty(),
    ),
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
    switchMap(userId => createTrashTasksObservable(userId)),
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
      assert(list, "No task list")
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

export const rootEpic = combineEpics(
  taskListsEpic,
  tasksEpic,
  trashTasksEpic,
  updateTaskListCountsEpic,
)
