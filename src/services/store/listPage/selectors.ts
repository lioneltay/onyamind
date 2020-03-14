import { State } from "./reducer"
import { notNil, assert } from "lib/utils"
import { sort, comparator } from "ramda"

export const taskLists = (state: State) => state.taskLists

export const selectedTaskListId = (state: State) => state.selectedTaskListId

export const tasks = (state: State, listId?: ID): Task[] | null => {
  const key = listId ?? selectedTaskListId(state)
  return (key ? state.tasks[key] : null) ?? null
}

export const primaryTaskList = (state: State): TaskList | null =>
  state.taskLists?.find(list => list.primary) ?? null

export const selectedTaskList = (state: State): TaskList | null =>
  taskLists(state)?.find(list => list.id === selectedTaskListId(state)) ??
  primaryTaskList(state)

export const selectedTaskIds = (state: State) => state.selectedTaskIds

type SelectedTasksOptions = {
  fromTrash?: boolean
}
export const selectedTasks = (
  state: State,
  { fromTrash }: SelectedTasksOptions = {},
): Task[] =>
  selectedTaskIds(state)
    .map(id =>
      (fromTrash ? trashTasks : tasks)(state)?.find(task => task.id === id),
    )
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

export const loadingTasks = (state: State) => state.tasks === null

export const completedTasks = (state: State): Task[] =>
  sortTasksByDate((tasks(state) ?? []).filter(task => task.complete))

export const incompletedTasks = (state: State): Task[] =>
  sortTasksByDate((tasks(state) ?? []).filter(task => !task.complete))

export const trashTasks = (state: State): Task[] => state.trashTasks ?? []

export const editingTaskId = (state: State) => state.editingTaskId

export const editingTask = (state: State) => {
  const taskId = editingTaskId(state)
  return tasks(state)?.find(task => task.id === taskId) ?? null
}
