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

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"

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
  const { editingTaskId, tasks } = useSelector((state, s) => ({
    editingTaskId: s.listPage.editingTaskId(state),
    tasks: s.listPage.tasks(state),
  }))

  const {
    stopEditingTask,
    editTask,
    toggleEditingTask,
    decompleteCompletedTasks,
    archiveCompletedTasks,
  } = useActions()

  const [showCompleteTasks, setShowCompleteTasks] = useState(false)

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

  const [completeTasks, incompleteTasks] = partition(
    task => task.complete,
    tasks,
  ).map(list => list.sort(comparator((t1, t2) => t1.createdAt > t2.createdAt)))

  console.log(completeTasks, incompleteTasks)

  return (
    <OuterContainer>
      <Container>
        <List className="p-0" style={{ background: theme.backgroundColor }}>
          <Transition
            items={incompleteTasks}
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
                        taskId: task.id,
                        title: values.title,
                        notes: values.notes,
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
              <Rotate flip={showCompleteTasks}>
                <IconButton>
                  <ExpandMore />
                </IconButton>
              </Rotate>
            </ListItemIcon>

            <ListItemText primary={`${completeTasks.length} checked off`} />

            <IconButtonMenu
              icon={<MoreVert />}
              items={[
                {
                  label: "Uncheck all items",
                  action: decompleteCompletedTasks,
                },
                {
                  label: "Delete completed items",
                  action: archiveCompletedTasks,
                },
              ]}
            />
          </ListItem>
        </List>

        <Collapse in={showCompleteTasks}>
          <Transition
            items={completeTasks}
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
                        taskId: task.id,
                        title: values.title,
                        notes: values.notes,
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
