import { State } from "./reducer"
import { Task, TaskList } from "types"

export const taskLists = (state: State) => state.taskLists

export const tasks = (state: State) => state.tasks

export const primaryTaskList = (state: State): TaskList | null =>
  state.taskLists?.find(list => list.primary) ?? null

export const selectedTaskList = (state: State): TaskList | null =>
  state.taskLists?.find(list => list.id === state.selectedTaskListID) ??
  primaryTaskList(state)
