import React, { Fragment } from "react"

import { IconButton } from "@material-ui/core"

import { Delete, Add, Check, SwapHoriz, Close } from "@material-ui/icons"

import Task from "components/Task"
import IconButtonMenu from "lib/components/IconButtonMenu"

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
    archiveTask,
    editTask,
    toggleTaskSelection,
    moveTask,
    toggleEditingTask,
    stopEditingTask,
    setMultiselect,
  } = useActions()
  const { taskLists, selectedTaskIds, multiselect, touchScreen } = useSelector(
    state => ({
      taskLists: state.listPage.taskLists,
      selectedTaskIds: state.listPage.selectedTaskIds,
      multiselect: state.listPage.multiselect,
      touchScreen: false,
    }),
  )

  if (!taskLists) {
    return null
  }

  const selected =
    Selected || selectedTaskIds.findIndex(id => id === task.id) >= 0

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
      swipeRightIcon={task.complete ? <Close /> : undefined}
      style={style}
      className={className}
      selected={selected}
      multiselect={multiselect}
      task={task}
      onItemClick={() => toggleEditingTask(task.id)}
      onSelectTask={id => {
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
              {task.complete ? <Add /> : <Check />}
            </IconButton>

            <IconButtonMenu
              icon={<SwapHoriz />}
              items={taskLists.map(list => ({
                label: list.name,
                action: () => moveTask({ taskId: task.id, listId: list.id }),
              }))}
            />

            <IconButton onClick={() => archiveTask(task.id)}>
              <Delete />
            </IconButton>
          </Fragment>
        )
      }
    />
  )
}
