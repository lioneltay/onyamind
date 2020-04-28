import React from "react"
import { CloseIcon } from "lib/icons"
import { Task, TaskProps as ComponentTaskProps } from "components"
import { useSelector, useActions } from "services/store"

export type TaskProps = Omit<ComponentTaskProps, "multiselect"> & {
  selected?: boolean
  backgroundColor?: string
}

const ListPageTask = React.forwardRef((props: TaskProps, ref: any) => {
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
      ref={ref}
      {...props}
      backgroundColor={props.backgroundColor}
      swipeRightIcon={props.complete ? <CloseIcon /> : undefined}
      selected={selected}
      multiselect={multiselect}
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
})

export default React.memo(ListPageTask)
