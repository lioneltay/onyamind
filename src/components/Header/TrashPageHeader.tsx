import React, { Fragment } from "react"

import { IconButtonMenu } from "lib/components"

import { IconButton } from "@material-ui/core"
import { Delete, DeleteSweep, SwapHoriz } from "@material-ui/icons"

import HeaderBase from "./HeaderBase"

import { useActions, useSelector } from "services/store"

export default () => {
  const { deleteSelectedTasks, emptyTrash, moveSelectedTasks } = useActions()

  const { taskLists } = useSelector(state => ({
    taskLists: state.listPage.taskLists ?? [],
  }))

  return (
    <HeaderBase
      title="Trash"
      editingActions={
        <Fragment>
          <IconButtonMenu
            icon={<SwapHoriz />}
            items={taskLists.map(list => ({
              label: list.name,
              action: () =>
                moveSelectedTasks({ listId: list.id, fromTrash: true }),
            }))}
          />

          <IconButton onClick={deleteSelectedTasks}>
            <Delete />
          </IconButton>
        </Fragment>
      }
      actions={
        <IconButton onClick={emptyTrash}>
          <DeleteSweep />
        </IconButton>
      }
    />
  )
}
