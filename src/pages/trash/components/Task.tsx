import React, { Fragment } from "react"

import { IconButton } from "@material-ui/core"

import { DeleteIcon, SwapHorizIcon, RestoreIcon } from "lib/icons"

import { Task } from "components"
import { IconButtonMenu } from "lib/components"

import { useSelector, useActions } from "services/store"

export type Props = Stylable & {
  selected?: boolean
  task: Task
  backgroundColor?: string
}

export default ({
  style,
  className,
  task,
  backgroundColor,
  selected: Selected,
}: Props) => {
  const {
    deleteTask,
    toggleTaskSelection,
    unarchiveTask,
    setMultiselect,
  } = useActions("trashPage")
  const { taskLists, selectedTaskIds, multiselect } = useSelector((state) => ({
    taskLists: state.app.taskLists,
    selectedTaskIds: state.trashPage.selectedTaskIds,
    multiselect: state.trashPage.multiselect,
    touchScreen: false,
  }))

  if (!taskLists) {
    return null
  }

  const selected =
    Selected || selectedTaskIds.findIndex((id) => id === task.id) >= 0

  return (
    <Task
      onSwipeLeft={() => deleteTask({ taskId: task.id, listId: task.listId })}
      onSwipeRight={() => unarchiveTask(task.id)}
      swipeRightIcon={<RestoreIcon />}
      backgroundColor={backgroundColor}
      style={style}
      className={className}
      selected={selected}
      multiselect={multiselect}
      task={task}
      onSelectTask={(id) => {
        toggleTaskSelection(id)
        if (!multiselect) {
          setMultiselect(true)
        }
      }}
    />
  )
}
