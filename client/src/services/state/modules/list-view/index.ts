import { createReducer } from "lib/rxstate"

// import { reducer_s as editingReducer } from "./editing"
// import { reducer_s as tasksReducer } from "./tasks"
// import { reducer_s as miscReducer } from "./misc"

// export * from "./editing"
// export * from "./tasks"
// export * from "./misc"

export type State = {
  selected_task_list_id: ID | null
  editing: boolean
  task_delete_markers: { [key: string]: ID }
  tasks: Task[] | null
  selected_task_ids: ID[]
  editing_task_id: ID | null
}

export const initial_state: State = {
  task_delete_markers: {},
  selected_task_list_id: null,
  editing: false,
  tasks: null,
  selected_task_ids: [],
  editing_task_id: null,
}

// export const reducer_s = createReducer<State>(
//   editingReducer,
//   tasksReducer,
//   miscReducer,
// )
