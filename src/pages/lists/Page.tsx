import { RouteComponentProps } from "react-router-dom"

import React, { Fragment } from "react"
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

import { Text, ListItemText } from "lib/components"

import { ExpandMore, MoreVert, Add } from "@material-ui/icons"

import { IconButtonMenu } from "lib/components"

import Task from "./components/Task"

import CollapsableEditor from "./components/CollapsableEditor"
import EditModal from "./components/EditModal"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"

import { listPageUrl } from "./routing"

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

type Props = RouteComponentProps<{ listId: string; listName: string }> & {}

export default ({
  match: {
    params: { listName, listId },
  },
  history,
}: Props) => {
  const theme = useTheme()

  const {
    stopEditingTask,
    editTask,
    decompleteCompletedTasks,
    archiveCompletedTasks,
    selectTaskList,
  } = useActions()

  const {
    editingTask,
    completeTasks,
    incompleteTasks,
    loadingTasks,
    selectedTaskList,
    multiselect,
  } = useSelector((state, s) => ({
    multiselect: state.listPage.multiselect,
    editingTask: s.listPage.editingTask(state),
    completeTasks: s.listPage.completedTasks(state),
    incompleteTasks: s.listPage.incompletedTasks(state),
    loadingTasks: s.listPage.loadingTasks(state),
    selectedTaskList: s.listPage.selectedTaskList(state),
  }))

  React.useEffect(() => {
    if (selectedTaskList && !listId && !listName) {
      history.push(
        listPageUrl({
          listId: selectedTaskList.id,
          listName: selectedTaskList.name,
        }),
      )
    }
  }, [selectedTaskList?.id])

  React.useEffect(() => {
    selectTaskList(listId)

    return () => {
      selectTaskList(null)
    }
  }, [listId])

  const [showCompleteTasks, setShowCompleteTasks] = React.useState(false)

  const toggleShowCompleteTasks = React.useCallback(() => {
    setShowCompleteTasks(show => !show)
  }, [])

  if (loadingTasks) {
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

  return (
    <Fragment>
      <OuterContainer>
        <Container>
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

          <List>
            <Collapse in={showCompleteTasks}>
              {completeTasks.map(task => (
                <Fragment key={task.id}>
                  <Task
                    backgroundColor={theme.backgroundFadedColor}
                    task={task}
                  />
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
        </Container>
      </OuterContainer>

      {/* {!multiselect && editingTask ? (
        <EditModal
          open={!!editingTask}
          onClose={() => {
            stopEditingTask()
          }}
          initialValues={editingTask || {}}
          onSubmit={async values => {
            stopEditingTask()
            await editTask({
              taskId: editingTask.id,
              title: values.title,
              notes: values.notes,
            })
          }}
        />
      ) : null} */}
    </Fragment>
  )
}
