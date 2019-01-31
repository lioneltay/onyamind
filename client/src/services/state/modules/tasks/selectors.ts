import { State } from "services/state"

export const tasks = ({ task_delete_markers, tasks }: State): null | Task[] =>
  tasks && tasks.filter(task => !task_delete_markers[task.id])

export const completeTasks = ({
  task_delete_markers,
  tasks,
}: State): null | Task[] =>
  tasks && tasks.filter(task => task.complete && !task_delete_markers[task.id])

export const incompleteTasks = ({
  task_delete_markers,
  tasks,
}: State): null | Task[] =>
  tasks && tasks.filter(task => !task.complete && !task_delete_markers[task.id])
