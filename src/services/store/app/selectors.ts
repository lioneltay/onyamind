import { State } from "services/store"

export const selectedTaskList = (state: State) =>
  state.app.taskLists?.find(list => list.id === state.app.selectedTaskListId)

export const primaryTaskList = (state: State) =>
  state.app.taskLists?.find(list => list.primary)
