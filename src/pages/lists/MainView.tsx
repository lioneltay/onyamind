import {
  Collapse,
  Fade,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
} from "@material-ui/core"
import { EditTaskModal } from "components"
import { IconButtonMenu, ListItemText } from "lib/components"
import { DeleteIcon, ExpandMoreIcon, MoreVertIcon } from "lib/icons"
import React from "react"
import { useActions, useSelector } from "services/store"
import styled from "styled-components"
import { TransitionTaskList } from "./components"
import { orderTasks, useHandleRoutineReset } from "./utils"

const Flip = styled.div<{ flip: boolean }>`
  transform: rotate(${({ flip }) => (flip ? "-180deg" : "0")});
  transition: 300ms;
`

const MainView = () => {
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
      incompleteTasks: s.listPage.incompletedTasks(state),
      completeTasks: s.listPage.completedTasks(state),
      tasks,
      selectedTaskList,
      multiselect: state.listPage.multiselect,
      editingTask: s.listPage.editingTask(state),
      loadingTasks: s.listPage.loadingTasks(state),
      selectedTaskIds: state.listPage.selectedTaskIds,
    }
  })

  useHandleRoutineReset()

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
