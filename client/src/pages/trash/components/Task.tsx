import React, { Fragment } from "react"
import styled from "styled-components"

import IconButton from "@material-ui/core/IconButton"

import Restore from "@material-ui/icons/Restore"
import Delete from "@material-ui/icons/Delete"

import { connect } from "services/state"
import { deleteTask, editTask } from "services/state/modules/tasks"

import TaskGestureContainer from "components/TaskGestureContainer"
import Task from "components/Task"

const ItemContainer = styled.div`
  background: white;
`

export type Props = {
  task: Task
  selected: boolean
  editing: boolean
  touch_screen: boolean
  onItemClick?: (id: ID) => void
  onSelectTask?: (id: ID) => void
}

const TrashTask: React.FunctionComponent<Props> = ({
  task,
  touch_screen,
  selected,
  editing,
  onItemClick = () => {},
  onSelectTask = () => {},
}) => {
  return (
    <TaskGestureContainer
      onSwipeLeft={() => deleteTask(task.id)}
      onSwipeRight={() =>
        editTask({
          task_id: task.id,
          task_data: { archived: false },
        })
      }
      leftBackground="tomato"
      leftIcon={<Delete />}
      rightBackground="dodgerblue"
      rightIcon={<Restore />}
    >
      <ItemContainer>
        <Task
          selected={selected}
          editing={editing}
          task={task}
          onItemClick={onItemClick}
          onSelectTask={onSelectTask}
          hoverActions={
            editing || touch_screen ? null : (
              <Fragment>
                <IconButton
                  onClick={() =>
                    editTask({
                      task_id: task.id,
                      task_data: { archived: false },
                    })
                  }
                >
                  <Restore />
                </IconButton>
                <IconButton onClick={() => deleteTask(task.id)}>
                  <Delete />
                </IconButton>
              </Fragment>
            )
          }
        />
      </ItemContainer>
    </TaskGestureContainer>
  )
}

export default connect(
  ({ touch_screen, trash: { selected_task_ids } }, { task }: Props) => {
    return {
      selected: selected_task_ids.findIndex(id => id === task.id) >= 0,
      touch_screen,
      editing: selected_task_ids.length > 0,
    }
  },
)(TrashTask)
