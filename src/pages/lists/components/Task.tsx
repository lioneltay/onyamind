import React from "react"
import { CloseIcon } from "lib/icons"
import { Task } from "components"
import { useSelector, useActions } from "services/store"

export type Props = Stylable & {
  selected?: boolean
  task: Task
  backgroundColor?: string
}

export default ({ style, className, task, backgroundColor }: Props) => {
  const {
    archiveTask,
    editTask,
    toggleTaskSelection,
    toggleEditingTask,
    stopEditingTask,
    setMultiselect,
  } = useActions("listPage")
  const { taskLists, selectedTaskIds, multiselect } = useSelector((state) => ({
    taskLists: state.app.taskLists,
    selectedTaskIds: state.listPage.selectedTaskIds,
    multiselect: state.listPage.multiselect,
    selectedTaskListId: state.app.selectedTaskListId,
  }))

  if (!taskLists) {
    return null
  }

  const selected = selectedTaskIds.findIndex((id) => id === task.id) >= 0

  return (
    <Task
      onSwipeLeft={() => archiveTask(task.id)}
      onSwipeRight={() =>
        editTask({
          taskId: task.id,
          complete: !task.complete,
        })
      }
      backgroundColor={backgroundColor}
      swipeRightIcon={task.complete ? <CloseIcon /> : undefined}
      style={style}
      className={className}
      selected={selected}
      multiselect={multiselect}
      task={task}
      onItemClick={() => toggleEditingTask(task.id)}
      onSelectTask={(id) => {
        stopEditingTask()
        toggleTaskSelection(id)
        if (!multiselect) {
          setMultiselect(true)
        }
      }}
    />
  )
}
