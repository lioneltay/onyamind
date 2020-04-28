import React from "react"
import { noopTemplate as css, assert } from "lib/utils"
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

import { ExpandMoreIcon, MoreVertIcon, CheckIcon, DeleteIcon } from "lib/icons"

import { Task, TransitionTaskList } from "./components"

import { EditTaskModal } from "components"

import { useTheme } from "theme"
import { useSelector, useActions } from "services/store"

const Flip = styled.div<{ flip: boolean }>`
  transform: rotate(${({ flip }) => (flip ? "-180deg" : "0")});
  transition: 300ms;
`

/**
 * Orders tasks according to task order.
 * Tasks not included in the task order are added in front with the existing order preserved.
 */
function orderTasks(tasks: Task[], taskOrder: ID[]): Task[] {
  const copy = [...tasks]
  const orderedTasks = []
  const extraTasks = []

  while (copy.length > 0) {
    const task = copy.shift()
    assert(task, "Must exist since length > 0")

    if (taskOrder.find((id) => task.id === id)) {
      orderedTasks.push(task)
    } else {
      extraTasks.push(task)
    }
  }

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

  return {
    completeTasks,
    incompleteTasks,
  }
}

const MainView = () => {
  const theme = useTheme()

  const {
    listPage: {
      stopEditingTask,
      editTask,
      checkTask,
      uncheckTask,
      decompleteCompletedTasks,
      deleteCompletedTasks,
      deleteTask,
    },
    app: { reorderTasks },
  } = useActions()

  const {
    editingTask,
    loadingTasks,
    multiselect,
    selectedTaskList,
    completeTasks,
    incompleteTasks,
    tasks,
    taskOrder,
  } = useSelector((state, s) => {
    const selectedTaskList = s.app.selectedTaskList(state)
    const tasks = orderTasks(
      state.listPage.tasks ?? [],
      selectedTaskList?.taskOrder ?? [],
    )

    return {
      taskOrder: tasks.map((task) => task.id),
      ...partitionTasks(tasks, {
        routine: selectedTaskList?.routine,
      }),
      tasks,
      selectedTaskList,
      multiselect: state.listPage.multiselect,
      editingTask: s.listPage.editingTask(state),
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
    <React.Fragment>
      <TransitionTaskList
        tasks={incompleteTasks.map((task) => ({ ...task, complete: false }))}
        onSwipeLeft={(id) => {
          const task = tasks.find((task) => task.id === id)
          if (task) {
            deleteTask({ taskId: task.id, listId: task.listId })
          }
        }}
        onSwipeRight={(id) => checkTask(id)}
        onDragEnd={(result) => {
          if (!result.destination || !selectedTaskList) {
            return
          }

          const fromTaskId = incompleteTasks[result.source.index].id
          const toTaskId = incompleteTasks[result.destination.index].id

          reorderTasks({
            fromTaskId,
            toTaskId,
            taskOrder,
            listId: selectedTaskList.id,
          })
        }}
      />

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
                action: deleteCompletedTasks,
              },
            ]}
          />
        </ListItem>
      </List>

      <List>
        <Collapse in={showCompleteTasks}>
          <TransitionTaskList
            tasks={completeTasks.map((task) => ({ ...task, complete: true }))}
            onSwipeLeft={(id) => {
              const task = tasks.find((task) => task.id === id)
              if (task) {
                deleteTask({ taskId: task.id, listId: task.listId })
              }
            }}
            onSwipeRight={(id) => uncheckTask(id)}
            onDragEnd={(result) => {
              if (!result.destination || !selectedTaskList) {
                return
              }

              const fromTaskId = completeTasks[result.source.index].id
              const toTaskId = completeTasks[result.destination.index].id

              reorderTasks({
                fromTaskId,
                toTaskId,
                taskOrder,
                listId: selectedTaskList.id,
              })
            }}
          />
        </Collapse>
      </List>

      {editingTask ? (
        <EditTaskModal
          disableBackdropClick
          onClose={() => stopEditingTask()}
          secondaryAction={
            <IconButton
              onClick={() => {
                stopEditingTask()
                const task = tasks.find((task) => task.id === editingTask.id)
                if (task) {
                  deleteTask({ taskId: task.id, listId: task.listId })
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          }
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
    </React.Fragment>
  )
}

export default MainView
