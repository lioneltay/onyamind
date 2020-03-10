import { State } from "services/state"

export const primaryTaskList = ({ task_lists }: State): TaskList | null => {
  return (task_lists && task_lists.find(list => list.primary)) || null
}

const primaryTaskListId = (state: State): ID | null => {
  const primary_list = primaryTaskList(state)
  return primary_list && primary_list.id
}
