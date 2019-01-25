import { createObservableStateTools, createReducer } from "lib/rxstate"
import { ID, User, Task, TaskList } from "../../types"
import { Subject } from "rxjs"

import { reducer_s as warningFooterReducer } from "./modules/warning-footer"
import { reducer_s as authReducer } from "./modules/auth"
import { reducer_s as editingReducer } from "./modules/editing"
import { reducer_s as miscReducer } from "./modules/misc"
import { reducer_s as tasksReducer } from "./modules/tasks"
import { reducer_s as taskListsReducer } from "./modules/task-lists"

export type State = {
  selected_task_list_id: ID | null
  touch_screen: boolean
  editing: boolean
  user: User | null
  tasks: Task[] | null
  task_lists: TaskList[] | null
  show_edit_modal: boolean
  editing_task_id: ID | null
  new_task_title: string
  selected_task_ids: ID[]
  show_drawer: boolean
  show_warning_footer: boolean
}

export const initial_state: State = {
  selected_task_list_id: null,
  touch_screen: false,
  editing: false,
  user: null,
  tasks: null,
  task_lists: null,
  show_edit_modal: false,
  editing_task_id: null,
  new_task_title: "",
  selected_task_ids: [],
  show_drawer: false,
  show_warning_footer: false,
}

export * from "./modules/misc"

export const state_s = new Subject<State>()
export const reducer_s = createReducer<State>(state_s, [
  miscReducer,
  tasksReducer,
  taskListsReducer,
  warningFooterReducer,
  authReducer,
  editingReducer,
])

export const { Provider, connect } = createObservableStateTools(
  reducer_s,
  initial_state,
)
