import React, { Fragment } from "react"

import { IconButton } from "@material-ui/core"

import { Delete, Add, Check, SwapHoriz } from "@material-ui/icons"

import TaskGestureContainer from "components/TaskGestureContainer"
import Task from "components/Task"
import IconButtonMenu from "lib/components/IconButtonMenu"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"

export type Props = Stylable & {
  selected?: boolean
  task: Task
  onItemClick?: (id: ID) => void
  onSelectTask?: (id: ID) => void
}

export default ({
  style,
  className,
  task,
  selected: Selected,
  onItemClick = () => {},
  onSelectTask = () => {},
}: Props) => {
  const theme = useTheme()

  const { archiveTask, editTask, toggleTaskSelection, moveTask } = useActions()
  const { taskLists, selectedTaskIds, editing, touchScreen } = useSelector(
    state => ({
      taskLists: state.listPage.taskLists,
      selectedTaskIds: state.listPage.selectedTaskIds,
      editing: false,
      touchScreen: false,
    }),
  )

  if (!taskLists) {
    return null
  }

  const selected =
    Selected || selectedTaskIds.findIndex(id => id === task.id) >= 0

  return (
    <TaskGestureContainer
      onSwipeLeft={() => archiveTask(task.id)}
      onSwipeRight={() =>
        editTask({
          taskId: task.id,
          complete: !task.complete,
        })
      }
      leftBackground="tomato"
      leftIcon={<Delete />}
      rightBackground="dodgerblue"
      rightIcon={<Check />}
    >
      <div
        style={{
          background: task.complete
            ? theme.backgroundFadedColor
            : theme.backgroundColor,
        }}
      >
        <Task
          style={style}
          className={className}
          selected={selected}
          editing={editing}
          task={task}
          onItemClick={onItemClick}
          onSelectTask={id => {
            onSelectTask(id)
            toggleTaskSelection(id)
          }}
          hoverActions={
            editing || touchScreen ? null : (
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
                    action: () =>
                      moveTask({ taskId: task.id, listId: list.id }),
                  }))}
                />

                <IconButton onClick={() => archiveTask(task.id)}>
                  <Delete />
                </IconButton>
              </Fragment>
            )
          }
          actions={
            editing || !touchScreen || !task.complete ? null : (
              <IconButton
                onClick={() =>
                  editTask({
                    taskId: task.id,
                    complete: !task.complete,
                  })
                }
              >
                <Add />
              </IconButton>
            )
          }
        />
      </div>
    </TaskGestureContainer>
  )
}
