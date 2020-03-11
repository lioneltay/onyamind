import { State as StoreState } from "services/store"
import { State } from "./reducer"
import { notNil } from "lib/utils"

const slice = (state: StoreState): State => state.listPage

export const taskLists = (state: StoreState) => slice(state).taskLists

export const tasks = (state: StoreState) => slice(state).tasks

export const primaryTaskList = (state: StoreState): TaskList | null =>
  slice(state).taskLists?.find(list => list.primary) ?? null

export const selectedTaskListId = (state: StoreState) =>
  slice(state).selectedTaskListId

export const selectedTaskList = (state: StoreState): TaskList | null =>
  taskLists(state)?.find(list => list.id === selectedTaskListId(state)) ??
  primaryTaskList(state)

export const selectedTaskIds = (state: StoreState) =>
  slice(state).selectedTaskIds

export const selectedTasks = (state: StoreState): Task[] =>
  selectedTaskIds(state)
    .map(id => tasks(state)?.find(task => task.id === id))
    .filter(notNil)

export const allSelectedTasksComplete = (state: StoreState): boolean =>
  selectedTasks(state).every(task => task.complete)

export const allSelectedTasksInComplete = (state: StoreState): boolean =>
  selectedTasks(state).every(task => !task.complete)

export const completedTasks = (state: StoreState): Task[] =>
  tasks(state)?.filter(task => task.complete) ?? []

export const incompletedTasks = (state: StoreState): Task[] =>
  tasks(state)?.filter(task => !task.complete) ?? []

export const trashTasks = (state: StoreState): Task[] =>
  slice(state).trashTasks ?? []

export const editingTaskId = (state: StoreState) => slice(state).editingTaskId

