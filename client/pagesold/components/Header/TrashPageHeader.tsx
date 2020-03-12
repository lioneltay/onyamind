import React from "react"

import IconButton from "@material-ui/core/IconButton"
import Delete from "@material-ui/icons/Delete"
import DeleteSweep from "@material-ui/icons/DeleteSweep"

import { connect } from "services/state"
import {
  emptyTrash,
  clearTaskSelection,
  deleteSelectedTasks,
} from "services/state/modules/trash"

import HeaderBase from "./HeaderBase"

type Props = {
  theme: Theme
  editing: boolean
  number_of_selected_tasks: number
}

const TrashPageHeader: React.FunctionComponent<Props> = ({
  number_of_selected_tasks,
  editing,
  theme,
}) => {
  return (
    <HeaderBase
      title="Trash"
      number_of_selected_tasks={number_of_selected_tasks}
      editing={editing}
      onStopEditing={clearTaskSelection}
      editing_actions={
        <IconButton onClick={deleteSelectedTasks}>
          <Delete />
        </IconButton>
      }
      actions={
        <IconButton onClick={emptyTrash}>
          <DeleteSweep />
        </IconButton>
      }
    />
  )
}

export default connect(state => {
  const { selected_task_ids } = state.trash

  return {
    theme: state.settings.theme,
    editing: selected_task_ids.length > 0,
    number_of_selected_tasks: selected_task_ids.length,
  }
})(TrashPageHeader)
