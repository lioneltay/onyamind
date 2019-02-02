import React, { Fragment } from "react"

import IconButton from "@material-ui/core/IconButton"

import Delete from "@material-ui/icons/Delete"
import Add from "@material-ui/icons/Add"
import Check from "@material-ui/icons/Check"
import SwapHoriz from "@material-ui/icons/SwapHoriz"

import { connect } from "services/state"
import {
  archiveTask,
  editTask,
  moveTaskToList,
  toggleTaskSelection,
} from "services/state/modules/list-view"

import TaskGestureContainer from "components/TaskGestureContainer"
import Task from "components/Task"
import IconButtonMenu from "lib/components/IconButtonMenu"

export type Props = Stylable & {
  theme: Theme
  selected?: boolean
  task: Task
  onItemClick?: (id: ID) => void
  onSelectTask?: (id: ID) => void
  editing: boolean
  selected_task_ids: ID[]
  touch_screen: boolean
  task_lists: TaskList[] | null
}

const MainViewTask: React.FunctionComponent<Props> = ({
  theme,
  style,
  className,
  task,
  selected: _selected,
  onItemClick = () => {},
  onSelectTask = () => {},
  editing,
  selected_task_ids,
  touch_screen,
  task_lists,
}) => {
  if (!task_lists) {
    return null
  }

  const selected =
    _selected || selected_task_ids.findIndex(id => id === task.id) >= 0

  return (
    <TaskGestureContainer
      onSwipeLeft={() => archiveTask(task.id)}
      onSwipeRight={() =>
        editTask({
          task_id: task.id,
          task_data: { complete: !task.complete },
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
            ? theme.background_faded_color
            : theme.background_color,
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
            editing || touch_screen ? null : (
              <Fragment>
                <IconButton
                  onClick={() =>
                    editTask({
                      task_id: task.id,
                      task_data: { complete: !task.complete },
                    })
                  }
                >
                  {task.complete ? <Add /> : <Check />}
                </IconButton>

                <IconButtonMenu
                  icon={<SwapHoriz />}
                  items={task_lists.map(list => ({
                    label: list.name,
                    action: () =>
                      moveTaskToList({ task_id: task.id, list_id: list.id }),
                  }))}
                />

                <IconButton onClick={() => archiveTask(task.id)}>
                  <Delete />
                </IconButton>
              </Fragment>
            )
          }
          actions={
            editing || !touch_screen || !task.complete ? null : (
              <IconButton
                onClick={() =>
                  editTask({
                    task_id: task.id,
                    task_data: { complete: !task.complete },
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

export default connect(state => ({
  theme: state.settings.theme,
  task_lists: state.task_lists,
  editing: state.list_view.editing,
  selected_task_ids: state.list_view.selected_task_ids,
  touch_screen: state.ui.touch_screen,
}))(MainViewTask)
