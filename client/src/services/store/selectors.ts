import { State } from "./reducer"
import { notNil } from "lib/utils"

export const taskLists = (state: State) => state.taskLists

export const tasks = (state: State) => state.tasks

export const primaryTaskList = (state: State): TaskList | null =>
  state.taskLists?.find(list => list.primary) ?? null

export const selectedTaskList = (state: State): TaskList | null =>
  state.taskLists?.find(list => list.id === state.selectedTaskListId) ??
  primaryTaskList(state)

export const selectedTasks = (state: State): Task[] =>
  state.selectedTaskIds
    .map(id => state.tasks?.find(task => task.id === id))
    .filter(notNil)

export const completedTasks = (state: State): Task[] =>
  state.tasks?.filter(task => task.complete) ?? []

export const incompletedTasks = (state: State): Task[] =>
  state.tasks?.filter(task => !task.complete) ?? []

export const trashTasks = (state: State): Task[] => state.trashTasks ?? []
