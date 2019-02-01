import React, { Fragment } from "react"
import { styled } from "theme"

import IconButton from "@material-ui/core/IconButton"

import Delete from "@material-ui/icons/Delete"
import Add from "@material-ui/icons/Add"
import Check from "@material-ui/icons/Check"

import { connect } from "services/state"
import { toggleTaskSelection } from "services/state/modules/editing"
import { archiveTask, editTask } from "services/state/modules/tasks"

import TaskGestureContainer from "components/TaskGestureContainer"
import Task from "components/Task"

const ItemContainer = styled.div`
  /* background: ${({ theme }) => theme.background_color}; */
`

export type Props = Stylable & {
  task: Task
  onItemClick?: (id: ID) => void
  editing: boolean
  selected_task_ids: ID[]
  touch_screen: boolean
}

const MainViewTask: React.FunctionComponent<Props> = ({
  style,
  className,
  task,
  onItemClick = () => {},
  editing,
  selected_task_ids,
  touch_screen,
}) => {
  const selected = selected_task_ids.findIndex(id => id === task.id) >= 0

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
      <ItemContainer>
        <Task
          style={style}
          className={className}
          selected={selected}
          editing={editing}
          task={task}
          onItemClick={onItemClick}
          onSelectTask={id => toggleTaskSelection(id)}
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
      </ItemContainer>
    </TaskGestureContainer>
  )
}

export default connect(state => ({
  editing: state.editing,
  selected_task_ids: state.selected_task_ids,
  touch_screen: state.touch_screen,
}))(MainViewTask)
