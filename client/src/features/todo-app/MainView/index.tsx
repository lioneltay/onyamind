import React, { useState } from "react"
import styled from "styled-components"
import { useAppState } from "../state"
import { comparator, partition } from "ramda"

import List from "@material-ui/core/List"
import Collapse from "@material-ui/core/Collapse"

import Task from "./components/Task"
import EditModal from "./components/EditModal"
import ToggleRow from "./components/ToggleRow"

const OldPageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

const MainView: React.FunctionComponent = () => {
  const {
    tasks,
    editing_task_id,
    show_edit_modal,
    actions: {
      stopEditingTask,
      editTask,
      uncheckCompletedTasks,
      deleteCompletedTasks,
    },
  } = useAppState()

  const [show, setShow] = useState(false)

  const editing_task = tasks.find(task => task.id === editing_task_id)

  const [complete_tasks, incomplete_tasks] = partition(
    task => task.complete,
    tasks,
  ).map(list =>
    list.sort(comparator((t1, t2) => t1.created_at > t2.created_at)),
  )

  return (
    <OldPageContainer>
      <Container>
        <List style={{ background: "white" }}>
          {incomplete_tasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </List>

        <ToggleRow
          open={show}
          onToggle={() => setShow(show => !show)}
          number_of_tasks={complete_tasks.length}
        />

        <Collapse in={show}>
          <List>
            {complete_tasks.map(task => (
              <Task key={task.id} task={task} />
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
            await editTask(editing_task.id, values)
            stopEditingTask()
          }}
        />
      ) : null}
    </OldPageContainer>
  )
}

export default MainView
