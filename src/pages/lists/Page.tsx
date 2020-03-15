import React, { Fragment } from "react"
import { RouteComponentProps } from "react-router-dom"
import { noopTemplate as css } from "lib/utils"
import styled from "styled-components"

import {
  List,
  ListItem,
  ListItemIcon,
  LinearProgress,
  Fade,
  Collapse,
  IconButton,
} from "@material-ui/core"

import { ListItemText, IconButtonMenu } from "lib/components"

import { ExpandMore, MoreVert } from "@material-ui/icons"

import Task from "./components/Task"

import { CollapsableEditor, Header } from "./components"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"

const Flip = styled.div<{ flip: boolean }>`
  transform: rotate(${({ flip }) => (flip ? "-180deg" : "0")});
  transition: 300ms;
`

const Content = () => {
  const theme = useTheme()

  const {
    listPage: {
      stopEditingTask,
      editTask,
      decompleteCompletedTasks,
      archiveCompletedTasks,
    },
  } = useActions()

  const {
    editingTask,
    completeTasks,
    incompleteTasks,
    loadingTasks,
    multiselect,
  } = useSelector((state, s) => ({
    multiselect: state.listPage.multiselect,
    editingTask: s.listPage.editingTask(state),
    completeTasks: s.listPage.completedTasks(state),
    incompleteTasks: s.listPage.incompletedTasks(state),
    loadingTasks: s.listPage.loadingTasks(state),
  }))

  const [showCompleteTasks, setShowCompleteTasks] = React.useState(false)

  const toggleShowCompleteTasks = React.useCallback(() => {
    setShowCompleteTasks(show => !show)
  }, [])

  if (loadingTasks) {
    return (
      <Fade in={true} style={{ transitionDelay: "800ms" }}>
        <LinearProgress />
      </Fade>
    )
  }

  return (
    <Fragment>
      <List className="p-0" style={{ background: theme.backgroundColor }}>
        {incompleteTasks.map(task => (
          <Fragment key={task.id}>
            <Task backgroundColor={theme.backgroundColor} task={task} />
            <CollapsableEditor
              task={task}
              open={!multiselect && editingTask?.id === task.id}
              onSubmit={async values => {
                stopEditingTask()
                await editTask({
                  taskId: task.id,
                  title: values.title,
                  notes: values.notes,
                })
              }}
            />
          </Fragment>
        ))}
      </List>

      <List className="p-0" onClick={toggleShowCompleteTasks}>
        <ListItem button>
          <ListItemIcon>
            <Flip flip={showCompleteTasks}>
              <IconButton>
                <ExpandMore />
              </IconButton>
            </Flip>
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

      <List>
        <Collapse in={showCompleteTasks}>
          {completeTasks.map(task => (
            <Fragment key={task.id}>
              <Task backgroundColor={theme.backgroundFadedColor} task={task} />
              <CollapsableEditor
                task={task}
                open={!multiselect && editingTask?.id === task.id}
                onSubmit={async values => {
                  stopEditingTask()
                  await editTask({
                    taskId: task.id,
                    title: values.title,
                    notes: values.notes,
                  })
                }}
              />
            </Fragment>
          ))}
        </Collapse>
      </List>
    </Fragment>
  )
}

type Props = RouteComponentProps<{ listId: string }> & {}

export default ({
  match: {
    params: { listId },
  },
}: Props) => {
  const { selectTaskList } = useActions("app")

  React.useEffect(() => {
    selectTaskList(listId)
    return () => {
      selectTaskList(null)
    }
  }, [])

  return (
    <Fragment>
      <Header />

      <section
        css={css`
          display: flex;
          justify-content: center;
          padding-bottom: 50px;
        `}
      >
        <div
          css={css`
            width: 100%;
            max-width: 600px;
          `}
        >
          <Content />
        </div>
      </section>
    </Fragment>
  )
}
