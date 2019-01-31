import React from "react"
import { createReducer, combineReducers } from "lib/rxstate"

import { tools } from "./tools"

import { reducer_s as warningFooterReducer } from "./modules/warning-footer"
import { reducer_s as authReducer } from "./modules/auth"
import { reducer_s as editingReducer } from "./modules/editing"
import { reducer_s as miscReducer } from "./modules/misc"
import { reducer_s as tasksReducer } from "./modules/tasks"
import { reducer_s as taskListsReducer } from "./modules/task-lists"
import {
  reducer_s as trashReducer,
  State as TrashState,
  initial_state as trash_initial_state,
} from "./modules/trash"

export type State = {
  trash: TrashState
  show_undo: boolean
  selected_task_list_id: ID | null
  touch_screen: boolean
  editing: boolean
  user: User | null
  task_delete_markers: { [key: string]: ID }
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
  trash: trash_initial_state,
  task_delete_markers: {},
  show_undo: false,
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

const combinedTrashReducer = combineReducers({
  trash: trashReducer,
}) as any

export const reducer_s = createReducer<State>(
  miscReducer,
  tasksReducer,
  taskListsReducer,
  warningFooterReducer,
  authReducer,
  editingReducer,
  combinedTrashReducer,
)

export const connect = tools.connect

export const Provider: React.FunctionComponent = ({ children }) => {
  return (
    <tools.Provider initialState={initial_state} reducerStream={reducer_s}>
      {children}
    </tools.Provider>
  )
}