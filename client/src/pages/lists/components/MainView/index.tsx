import React, { useState, useCallback } from "react"
import { noopTemplate as css } from "lib/utils"
import styled from "styled-components"
import { comparator, partition } from "ramda"
import { Transition, animated } from "react-spring"

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Fade,
  Collapse,
  IconButton,
} from "@material-ui/core"

import { ExpandMore, MoreVert } from "@material-ui/icons"

import IconButtonMenu from "lib/components/IconButtonMenu"

import Task from "./Task"

import CollapsableEditor from "./CollapsableEditor"

import { connect } from "services/state"
import { tasks } from "services/state/modules/list-view/selectors"

import { useTheme } from "theme"
import { useSelector } from "services/store"

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

export default () => {
  const theme = useTheme()
  const { editingTaskId, tasks } = useSelector(state => ({
    editingTaskId: 5,
    tasks: [],
  }))

  const [show_complete_tasks, setShowCompleteTasks] = useState(false)

  const toggleShowCompleteTasks = useCallback(() => {
    setShowCompleteTasks(show => !show)
  }, [])

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

  const [complete_tasks, incomplete_tasks] = partition(
    task => task.complete,
    tasks,
  ).map(list =>
    list.sort(comparator((t1, t2) => t1.created_at > t2.created_at)),
  )

  return (
    <OuterContainer>
      <Container>
        <List className="p-0" style={{ background: theme.background_color }}>
          <Transition
            items={incomplete_tasks}
            keys={task => task.id}
            initial={{ height: "auto", opacity: 1 }}
            from={{ height: 0, opacity: 0 }}
            enter={{ height: "auto", opacity: 1 }}
            leave={{ height: 0, opacity: 0 }}
          >
            {task => style => {
              return (
                <animated.div style={style}>
                  <Task
                    key={task.id}
                    task={task}
                    onItemClick={toggleEditingTask}
                    onSelectTask={stopEditingTask}
                    selected={editingTaskId === task.id}
                  />
                  <CollapsableEditor
                    task={task}
                    open={editingTaskId === task.id}
                    onSubmit={async values => {
                      stopEditingTask()
                      await editTask({
                        task_id: task.id,
                        task_data: values,
                      })
                    }}
                  />
                </animated.div>
              )
            }}
          </Transition>
        </List>

        <List className="p-0" onClick={toggleShowCompleteTasks}>
          <ListItem button>
            <ListItemIcon>
              <Rotate flip={show_complete_tasks}>
                <IconButton>
                  <ExpandMore />
                </IconButton>
              </Rotate>
            </ListItemIcon>

            <ListItemText primary={`${complete_tasks.length} checked off`} />

            <IconButtonMenu
              icon={<MoreVert />}
              items={[
                {
                  label: "Uncheck all items",
                  action: uncheckCompletedTasks,
                },
                {
                  label: "Delete completed items",
                  action: archiveCompletedTasks,
                },
              ]}
            />
          </ListItem>
        </List>

        <Collapse in={show_complete_tasks}>
          <Transition
            items={complete_tasks}
            keys={task => task.id}
            initial={{ height: "auto", opacity: 1 }}
            from={{ height: 0, opacity: 0 }}
            enter={{ height: "auto", opacity: 1 }}
            leave={{ height: 0, opacity: 0 }}
          >
            {task => style => {
              return (
                <animated.div style={style}>
                  <Task
                    key={task.id}
                    task={task}
                    onItemClick={toggleEditingTask}
                    onSelectTask={stopEditingTask}
                  />
                  <CollapsableEditor
                    task={task}
                    open={editingTaskId === task.id}
                    onSubmit={async values => {
                      stopEditingTask()
                      await editTask({
                        task_id: task.id,
                        task_data: values,
                      })
                    }}
                  />
                </animated.div>
              )
            }}
          </Transition>
        </Collapse>
      </Container>
    </OuterContainer>
  )
}
