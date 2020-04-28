import React from "react"
import { CloseIcon } from "lib/icons"
import { Task, TaskProps as ComponentTaskProps } from "components"
import { useSelector, useActions } from "services/store"

export type TaskProps = ComponentTaskProps & {
  selected?: boolean
  backgroundColor?: string
}

const ListPageTask = (props: TaskProps) => {
  const {
    toggleTaskSelection,
    toggleEditingTask,
    stopEditingTask,
    setMultiselect,
  } = useActions("listPage")
  const { selectedTaskIds, multiselect } = useSelector((state) => ({
    selectedTaskIds: state.listPage.selectedTaskIds,
    multiselect: state.listPage.multiselect,
  }))

  const selected = selectedTaskIds.findIndex((id) => id === props.id) >= 0

  return (
    <Task
      {...props}
      backgroundColor={props.backgroundColor}
      swipeRightIcon={props.complete ? <CloseIcon /> : undefined}
      selected={selected}
      onItemClick={() => toggleEditingTask(props.id)}
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

export default React.memo(ListPageTask)
