import React, { Fragment } from "react"
import { noopTemplate as css } from "lib/utils"

import { IconButtonMenu } from "lib/components"

import { IconButton } from "@material-ui/core"
import { DeleteIcon, DeleteSweepIcon, SwapHorizIcon } from "lib/icons"

import HeaderBase from "components/global/Header/components/HeaderBase"

import { useActions, useSelector } from "services/store"

export default () => {
  const {
    deleteSelectedTasks,
    emptyTrash,
    moveSelectedTasks,
    setMultiselect,
  } = useActions("trashPage")

  const {
    taskLists,
    multiselect,
    numberOfSelectedTasks,
    numberOfTasks,
  } = useSelector((state) => ({
    taskLists: state.app.taskLists ?? [],
    multiselect: state.trashPage.multiselect,
    numberOfSelectedTasks: state.trashPage.selectedTaskIds?.length ?? 0,
    numberOfTasks: state.trashPage.trashTasks?.length ?? 0,
  }))

  return (
    <HeaderBase
      css={css`
        position: sticky;
        top: 0;
        z-index: 1000;
      `}
      title="Trash"
      numberOfSelectedTasks={numberOfSelectedTasks}
      numberOfTasks={numberOfTasks}
      multiselect={multiselect}
      onEndMultiselect={() => setMultiselect(false)}
      multiselectActions={
        <Fragment>
          <IconButtonMenu
            icon={<SwapHorizIcon />}
            items={taskLists.map((list) => ({
              label: list.name,
              action: () => moveSelectedTasks({ listId: list.id }),
            }))}
          />

          <IconButton onClick={deleteSelectedTasks}>
            <DeleteIcon />
          </IconButton>
        </Fragment>
      }
      actions={
        <IconButton onClick={emptyTrash}>
          <DeleteSweepIcon />
        </IconButton>
      }
    />
  )
}
