import { State } from "services/store"
import { notNil } from "lib/utils"

export const selectedTaskIds = (state: State) => state.trashPage.selectedTaskIds

export const selectedTasks = (state: State): Task[] =>
  selectedTaskIds(state)
    .map(id => state.trashPage.trashTasks?.find(task => task.id === id))
    .filter(notNil)

export const allSelectedTasksComplete = (state: State): boolean =>
  selectedTasks(state).every(task => task.complete)

export const allSelectedTasksInComplete = (state: State): boolean =>
  selectedTasks(state).every(task => !task.complete)

export const trashTasks = (state: State): Task[] =>
  state.trashPage.trashTasks ?? []
