import { State } from "services/state"

export const tasks = ({
  list_view: { task_delete_markers, tasks },
}: State): null | Task[] =>
  tasks && tasks.filter(task => !task_delete_markers[task.id])

export const completeTasks = ({
  list_view: { task_delete_markers, tasks },
}: State): null | Task[] =>
  tasks && tasks.filter(task => task.complete && !task_delete_markers[task.id])

export const incompleteTasks = ({
  list_view: { task_delete_markers, tasks },
}: State): null | Task[] =>
  tasks && tasks.filter(task => !task.complete && !task_delete_markers[task.id])
