import React from "react"

import { IconButton } from "@material-ui/core"
import { Delete, DeleteSweep } from "@material-ui/icons"

import HeaderBase from "./HeaderBase"

import { useActions } from "services/store"

export default () => {
  const { deleteSelectedTasks, emptyTrash } = useActions()

  return (
    <HeaderBase
      title="Trash"
      editingActions={
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
