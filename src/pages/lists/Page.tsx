import React, { Fragment } from "react"
import { RouteComponentProps } from "react-router-dom"
import { noopTemplate as css } from "lib/utils"
import styled from "styled-components"
import { partition } from "ramda"

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

import { ExpandMoreIcon, MoreVertIcon } from "lib/icons"

import Task from "./components/Task"

import { EditTaskModal } from "components"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"
import { listPageUrl } from "pages/lists/routing"

import { onTasksChange } from "pages/lists/api"

import { Helmet } from "react-helmet"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

const Flip = styled.div<{ flip: boolean }>`
  transform: rotate(${({ flip }) => (flip ? "-180deg" : "0")});
  transition: 300ms;
`

function orderTasks(tasks: Task[], taskOrder: ID[]): Task[] {
  const [inOrderTasks, otherTasks] = partition(
    (task) => !!taskOrder.find((id) => task.id === id),
    tasks,
  )

  return [
    ...otherTasks,
    ...(taskOrder
      .map((id) => inOrderTasks.find((task) => task.id === id))
      .filter(Boolean) as Task[]),
  ]
}

type PartitionTaskOptions = {
  routine?: boolean
}

function partitionTasks(tasks: Task[], { routine }: PartitionTaskOptions) {
  const [completeTasks, incompleteTasks] = partition((task) => {
    if (!routine) {
      return task.complete
    }

    if (task.completedAt) {
      const completedDate = new Date(task.completedAt)
      const lastMidnight = new Date()
      lastMidnight.setHours(4)
      lastMidnight.setMinutes(0)
      lastMidnight.setSeconds(0)

      return completedDate > lastMidnight
    } else {
      return task.complete
    }
  }, tasks)

  return { completeTasks, incompleteTasks }
}

const Content = () => {
  const theme = useTheme()

  const {
    listPage: {
      stopEditingTask,
      editTask,
      decompleteCompletedTasks,
      archiveCompletedTasks,
    },
    app: { reorderTasks },
  } = useActions()

  const {
    editingTask,
    completeTasks,
    incompleteTasks,
    loadingTasks,
    multiselect,
    selectedTaskList,
  } = useSelector((state, s) => {
    const selectedTaskList = s.app.selectedTaskList(state)
    const tasks = s.listPage.tasks(state) ?? []
    const { completeTasks, incompleteTasks } = partitionTasks(tasks, {
      routine: selectedTaskList?.routine,
    })

    return {
      selectedTaskList,
      multiselect: state.listPage.multiselect,
      editingTask: s.listPage.editingTask(state),
      completeTasks,
      incompleteTasks: orderTasks(
        incompleteTasks,
        selectedTaskList?.taskOrder ?? [],
      ),
      loadingTasks: s.listPage.loadingTasks(state),
    }
  })

  const [showCompleteTasks, setShowCompleteTasks] = React.useState(false)

  const toggleShowCompleteTasks = React.useCallback(() => {
    setShowCompleteTasks((show) => !show)
  }, [])

  if (loadingTasks) {
    return (
      <Fade in={true} style={{ transitionDelay: "500ms" }}>
        <LinearProgress />
      </Fade>
    )
  }

  return (
    <Fragment>
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination?.index || !selectedTaskList) {
            return
          }

          const fromTaskId = incompleteTasks[result.source.index].id
          const toTaskId = incompleteTasks[result.destination.index].id

          reorderTasks({
            fromTaskId,
            toTaskId,
            taskOrder: incompleteTasks.map((task) => task.id),
            listId: selectedTaskList.id,
          })
        }}
      >
        <Droppable droppableId="dropzone">
          {(provided) => (
            <List
              {...provided.droppableProps}
              innerRef={provided.innerRef}
              className="p-0"
              style={{ background: theme.backgroundColor }}
            >
              {incompleteTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        transform: provided.draggableProps.style?.transform
                          ? provided.draggableProps.style.transform.replace(
                              /-?\d*\.?\d*px,/,
                              "0px,",
                            )
                          : undefined,
                      }}
                    >
                      <Task
                        IconProps={provided.dragHandleProps}
                        backgroundColor={theme.backgroundColor}
                        task={task}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <List className="p-0" onClick={toggleShowCompleteTasks}>
        <ListItem button>
          <ListItemIcon>
            <Flip flip={showCompleteTasks}>
              <IconButton>
                <ExpandMoreIcon />
              </IconButton>
            </Flip>
          </ListItemIcon>

          <ListItemText primary={`${completeTasks.length} checked off`} />

          <IconButtonMenu
            icon={<MoreVertIcon />}
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
          {completeTasks.map((task) => (
            <Task
              key={task.id}
              backgroundColor={theme.backgroundFadedColor}
              task={task}
            />
          ))}
        </Collapse>
      </List>

      {editingTask ? (
        <EditTaskModal
          disableBackdropClick
          title="Edit Task"
          onClose={() => stopEditingTask()}
          open={!multiselect && !!editingTask}
          initialValues={editingTask}
          onSubmit={async (values) => {
            stopEditingTask()
            await editTask({
              taskId: editingTask.id,
              title: values.title,
              notes: values.notes,
            })
          }}
        />
      ) : null}
    </Fragment>
  )
}

type Props = RouteComponentProps<{ listId: string }> & {}

export default ({
  match: {
    params: { listId },
  },
  history,
}: Props) => {
  const {
    app: { selectTaskList, selectPrimaryTaskList, setTaskLists },
    listPage: { setTasks },
  } = useActions()

  const {
    selectedTaskListId,
    taskListsLoaded,
    listIdParamValid,
    userId,
    selectedTaskList,
    completeTasksCount,
    incompleteTasksCount,
  } = useSelector((state, s) => ({
    userId: state.auth.user?.uid,
    selectedTaskListId: state.app.selectedTaskListId,
    selectedTaskList: s.app.selectedTaskList(state),
    taskListsLoaded: !!state.app.taskLists && state.app.taskLists.length > 0,
    listIdParamValid: !!state.app.taskLists?.find((list) => list.id === listId),
    completeTasksCount: s.listPage.completedTasks(state).length,
    incompleteTasksCount: s.listPage.incompletedTasks(state).length,
  }))

  React.useEffect(() => {
    if (userId && listId) {
      return onTasksChange({
        userId,
        listId,
        onChange: (tasks) => {
          setTasks({ tasks, listId })
        },
      })
    }
  }, [userId, listId])

  /**
   * Run once when taskLists are first loaded
   * If the listId param is valid make it the selectedTaskListId
   */
  React.useEffect(() => {
    if (taskListsLoaded) {
      if (listIdParamValid) {
        selectTaskList(listId)
      } else {
        selectPrimaryTaskList()
      }
    }

    return () => {
      selectTaskList(null)
    }
  }, [taskListsLoaded, listIdParamValid, listId])

  // Keep url synced with selectedTaskListId
  React.useEffect(() => {
    if (selectedTaskListId) {
      history.push(listPageUrl(selectedTaskListId))
    }
  }, [selectedTaskListId])

  return (
    <Fragment>
      <Helmet>
        {selectedTaskList?.name ? (
          incompleteTasksCount + completeTasksCount === 0 ? (
            <title>{selectedTaskList.name}</title>
          ) : (
            <title>{`${selectedTaskList?.name} (${completeTasksCount}/${
              completeTasksCount + incompleteTasksCount
            })`}</title>
          )
        ) : null}
      </Helmet>

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
