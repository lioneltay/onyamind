import React, { Fragment } from "react"

import { IconButton } from "@material-ui/core"

import {
  DeleteIcon,
  AddIcon,
  CheckIcon,
  SwapHorizIcon,
  CloseIcon,
  NotificationsIcon,
} from "lib/icons"

import { Task } from "components"
import { IconButtonMenu } from "lib/components"

import { useSelector, useActions } from "services/store"

import { createTaskNotification } from "services/notifications"

export type Props = Stylable & {
  selected?: boolean
  task: Task
  backgroundColor?: string
}

export default ({ style, className, task, backgroundColor }: Props) => {
  const {
    archiveTask,
    editTask,
    toggleTaskSelection,
    moveTask,
    toggleEditingTask,
    stopEditingTask,
    setMultiselect,
  } = useActions("listPage")
  const {
    taskLists,
    selectedTaskIds,
    multiselect,
    touchScreen,
    selectedTaskListId,
  } = useSelector((state) => ({
    taskLists: state.app.taskLists,
    selectedTaskIds: state.listPage.selectedTaskIds,
    multiselect: state.listPage.multiselect,
    touchScreen: false,
    selectedTaskListId: state.app.selectedTaskListId,
  }))

  if (!taskLists) {
    return null
  }

  const selected = selectedTaskIds.findIndex((id) => id === task.id) >= 0

  return (
    <Task
      onSwipeLeft={() => archiveTask(task.id)}
      onSwipeRight={() =>
        editTask({
          taskId: task.id,
          complete: !task.complete,
        })
      }
      backgroundColor={backgroundColor}
      swipeRightIcon={task.complete ? <CloseIcon /> : undefined}
      style={style}
      className={className}
      selected={selected}
      multiselect={multiselect}
      task={task}
      onItemClick={() => toggleEditingTask(task.id)}
      onSelectTask={(id) => {
        stopEditingTask()
        toggleTaskSelection(id)
        if (!multiselect) {
          setMultiselect(true)
        }
      }}
      hoverActions={
        multiselect || touchScreen ? null : (
          <Fragment>
            <IconButton
              onClick={() =>
                editTask({
                  taskId: task.id,
                  complete: !task.complete,
                })
              }
            >
              {task.complete ? <AddIcon /> : <CheckIcon />}
            </IconButton>

            <IconButtonMenu
              icon={<SwapHorizIcon />}
              items={taskLists
                .filter((list) => list.id !== selectedTaskListId)
                .map((list) => ({
                  label: list.name,
                  action: () => moveTask({ taskId: task.id, listId: list.id }),
                }))}
            />

            {!task.complete ? (
              <IconButton
                onClick={async () => {
                  createTaskNotification(task)
                }}
              >
                <NotificationsIcon />
              </IconButton>
            ) : null}

            <IconButton onClick={() => archiveTask(task.id)}>
              <DeleteIcon />
            </IconButton>
          </Fragment>
        )
      }
    />
  )
}
