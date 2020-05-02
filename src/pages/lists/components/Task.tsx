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
  const { selectedTaskIds } = useSelector((state) => ({
    selectedTaskIds: state.listPage.selectedTaskIds,
  }))

  const selected = selectedTaskIds.findIndex((id) => id === props.id) >= 0

  const handleItemClick = React.useCallback(
    (id: ID) => toggleEditingTask(id),
    [],
  )

  const handleSelectTask = React.useCallback((id: ID) => {
    stopEditingTask()
    toggleTaskSelection(id)
    setMultiselect(true)
  }, [])

  return (
    <Task
      {...props}
      backgroundColor={props.backgroundColor}
      swipeRightIcon={props.complete ? <CloseIcon /> : undefined}
      selected={selected}
      onItemClick={handleItemClick}
      onSelectTask={handleSelectTask}
    />
  )
}

export default React.memo(ListPageTask)
