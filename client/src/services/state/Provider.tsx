// import React from "react"
// import { combineReducers } from "lib/rxstate"

// import { tools, State } from "./index"
// import { merge } from "rxjs"

// import {
//   reducer_s as listViewReducer,
//   initial_state as list_view_initial_state,
// } from "./modules/list-view"
// import { reducer_s as listViewHooksReducer } from "./modules/list-view/hooks"

// import {
//   reducer_s as taskListsReducer,
//   initial_state as task_lists_initial_state,
// } from "./modules/task-lists"
// import { reducer_s as taskListsHooksReducer } from "./modules/task-lists/hooks"

// import {
//   reducer_s as uiReducer,
//   initial_state as ui_initial_state,
// } from "./modules/ui"
// import {
//   reducer_s as userReducer,
//   initial_state as user_initial_state,
// } from "./modules/user"
// import {
//   reducer_s as trashReducer,
//   initial_state as trash_initial_state,
// } from "./modules/trash"
// import {
//   reducer_s as settingsReducer,
//   initial_state as settings_initial_state,
// } from "./modules/settings"

// const initial_state: State = {
//   settings: settings_initial_state,
//   trash: trash_initial_state,
//   user: user_initial_state,
//   ui: ui_initial_state,
//   task_lists: task_lists_initial_state,
//   list_view: list_view_initial_state,
// }

// const reducer_s = combineReducers({
//   trash: trashReducer,
//   settings: settingsReducer,
//   user: userReducer,
//   ui: uiReducer,
//   task_lists: merge(taskListsReducer, taskListsHooksReducer),
//   list_view: merge(listViewReducer, listViewHooksReducer),
// }) as any

// export const connect = tools.connect

// export const Provider: React.FunctionComponent = ({ children }) => {
//   return (
//     <tools.Provider initialState={initial_state} reducerStream={reducer_s}>
//       {children}
//     </tools.Provider>
//   )
// }
