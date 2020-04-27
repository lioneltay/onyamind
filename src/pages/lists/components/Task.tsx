import React from "react"
import { CloseIcon } from "lib/icons"
import { Task, TaskProps } from "components"
import { useSelector, useActions } from "services/store"

export type Props = Omit<TaskProps, "multiselect"> & {
  selected?: boolean
  task: Task
  backgroundColor?: string
}

const ListPageTask = React.forwardRef(
  ({ task, backgroundColor, ...taskProps }: Props, ref: any) => {
    const {
      archiveTask,
      checkTask,
      uncheckTask,
      toggleTaskSelection,
      toggleEditingTask,
      stopEditingTask,
      setMultiselect,
    } = useActions("listPage")
    const { selectedTaskIds, multiselect } = useSelector((state) => ({
      selectedTaskIds: state.listPage.selectedTaskIds,
      multiselect: state.listPage.multiselect,
    }))

    const selected = selectedTaskIds.findIndex((id) => id === task.id) >= 0

    return (
      <Task
        ref={ref}
        {...taskProps}
        onSwipeLeft={() => archiveTask(task.id)}
        onSwipeRight={() =>
          task.complete ? uncheckTask(task.id) : checkTask(task.id)
        }
        backgroundColor={backgroundColor}
        swipeRightIcon={task.complete ? <CloseIcon /> : undefined}
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
  },
)

export default React.memo(ListPageTask)
