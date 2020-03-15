import { State } from "services/store"
import { notNil } from "lib/utils"
import { sort, comparator } from "ramda"

export const tasks = (state: State, listId?: ID): Task[] | null => {
  const key = listId || state.app.selectedTaskListId
  return (key ? state.listPage.tasks : null) ?? null
}

export const selectedTaskIds = (state: State) => state.listPage.selectedTaskIds

export const selectedTasks = (state: State): Task[] =>
  selectedTaskIds(state)
    .map(id => tasks(state)?.find(task => task.id === id))
    .filter(notNil)

export const allSelectedTasksComplete = (state: State): boolean =>
  selectedTasks(state).every(task => task.complete)

export const allSelectedTasksInComplete = (state: State): boolean =>
  selectedTasks(state).every(task => !task.complete)

const sortTasksByDate = (tasks: Task[]) =>
  sort(
    comparator((t1, t2) => t1.createdAt > t2.createdAt),
    tasks,
  )

export const loadingTasks = (state: State) => state.listPage.tasks === null

export const completedTasks = (state: State): Task[] =>
  sortTasksByDate((tasks(state) ?? []).filter(task => task.complete))

export const incompletedTasks = (state: State): Task[] =>
  sortTasksByDate((tasks(state) ?? []).filter(task => !task.complete))

export const editingTaskId = (state: State) => state.listPage.editingTaskId

export const editingTask = (state: State) => {
  const taskId = editingTaskId(state)
  return tasks(state)?.find(task => task.id === taskId) ?? null
}
