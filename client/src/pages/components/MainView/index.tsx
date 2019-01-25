import React, { useState } from "react"
import styled from "styled-components"
import { comparator, partition } from "ramda"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import LinearProgress from "@material-ui/core/LinearProgress"
import Fade from "@material-ui/core/Fade"

import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import ExpandMore from "@material-ui/icons/ExpandMore"
import MoreVert from "@material-ui/icons/MoreVert"

import IconButtonMenu from "../IconButtonMenu"
import Task from "./Task"
import EditModal from "./EditModal"

import { connect } from "services/state"
import { editTask } from "services/state/modules/tasks"
import {
  uncheckCompletedTasks,
  deleteCompletedTasks,
} from "services/state/modules/editing"
import { ConnectedDispatcher } from "lib/rxstate"

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

const Rotate = styled.div.attrs({})<{ flip: boolean }>`
  transform: rotate(${({ flip }) => (flip ? "-180deg" : "0")});
  transition: 300ms;
`

type Props = {
  tasks: Task[]
  uncheckCompletedTasks: ConnectedDispatcher<typeof uncheckCompletedTasks>
  deleteCompletedTasks: ConnectedDispatcher<typeof deleteCompletedTasks>
  editTask: ConnectedDispatcher<typeof editTask>
}

const MainView: React.FunctionComponent<Props> = ({
  tasks,
  uncheckCompletedTasks,
  deleteCompletedTasks,
}) => {
  const [editing_task_id, setEditingTaskId] = useState(null as ID | null)
  const [show_edit_modal, setShowEditModal] = useState(false)
  const [show_complete_tasks, setShowCompleteTasks] = useState(false)

  const toggleShowCompleteTasks = () => setShowCompleteTasks(show => !show)

  const stopEditingTask = () => {
    setEditingTaskId(null)
    setShowEditModal(false)
  }
  const startEditingTask = (id: ID) => {
    setEditingTaskId(id)
    setShowEditModal(true)
  }

  if (!tasks) {
    return (
      <OuterContainer>
        <Container>
          <Fade in={true} style={{ transitionDelay: "800ms" }}>
            <LinearProgress />
          </Fade>
        </Container>
      </OuterContainer>
    )
  }

  const editing_task = tasks.find(task => task.id === editing_task_id)

  const [complete_tasks, incomplete_tasks] = partition(
    task => task.complete,
    tasks,
  ).map(list =>
    list.sort(comparator((t1, t2) => t1.created_at > t2.created_at)),
  )

  return (
    <OuterContainer>
      <Container>
        <List className="p-0" style={{ background: "white" }}>
          {incomplete_tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onItemClick={() => startEditingTask(task.id)}
            />
          ))}
        </List>

        <List className="p-0">
          <ListItem button>
            <ListItemIcon>
              <Rotate flip={show_complete_tasks}>
                <IconButton onClick={toggleShowCompleteTasks}>
                  <ExpandMore />
                </IconButton>
              </Rotate>
            </ListItemIcon>

            <ListItemText
              onClick={toggleShowCompleteTasks}
              primary={`${complete_tasks.length} checked off`}
            />

            <IconButtonMenu
              icon={<MoreVert />}
              items={[
                {
                  label: "Uncheck all items",
                  action: uncheckCompletedTasks,
                },
                {
                  label: "Delete completed items",
                  action: deleteCompletedTasks,
                },
              ]}
            />
          </ListItem>
        </List>

        <Collapse in={show_complete_tasks}>
          <List className="p-0">
            {complete_tasks.map(task => (
              <Task
                key={task.id}
                task={task}
                onItemClick={() => startEditingTask(task.id)}
              />
            ))}
          </List>
        </Collapse>
      </Container>

      {editing_task ? (
        <EditModal
          initialValues={editing_task}
          open={show_edit_modal}
          onClose={stopEditingTask}
          onSubmit={async values => {
            await editTask({ task_id: editing_task.id, task_data: values })
            stopEditingTask()
          }}
        />
      ) : null}
    </OuterContainer>
  )
}

export default connect(
  state => ({ tasks: state.tasks }),
  { uncheckCompletedTasks, deleteCompletedTasks, editTask },
)(MainView)
