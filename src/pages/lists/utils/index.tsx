import React from "react"
import { assert } from "lib/utils"
import { partition } from "ramda"
import { useActions, useSelector, useStore } from "services/store"
import { uncheckTasks, editList } from "services/api"

/**
 * Orders tasks according to task order.
 * Tasks not included in the task order are added in front with the existing order preserved.
 */
export function orderTasks(tasks: Task[], taskOrder: ID[]): Task[] {
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

function getRoutineResetTime() {
  // Reset at 4:00am local time
  const resetTime = new Date()
  resetTime.setHours(4)
  resetTime.setMinutes(0)
  resetTime.setSeconds(0)

  return resetTime
}

function isUncheckedRoutineTask(task: Task): boolean {
  if (!task.completedAt) {
    return false
  }
  return new Date(task.completedAt) > getRoutineResetTime()
}

export const useHandleRoutineReset = () => {
  const listId = useSelector((state) => state.app.selectedTaskListId)
  const store = useStore()

  React.useEffect(() => {
    function handler() {
      const state = store.getState()

      const lists = state.app.taskLists || []
      const list = lists.find((list) => list.id === listId)

      if (
        !list ||
        (list.routineRestartedAt &&
          new Date(list.routineRestartedAt) > getRoutineResetTime())
      ) {
        return
      }

      const tasks = (state.listPage.tasks || []).filter(isUncheckedRoutineTask)

      uncheckTasks(tasks.map((task) => task.id))
      editList({
        listId: list.id,
        data: {
          routineRestartedAt: Date.now(),
        },
      })
    }

    handler()

    window.addEventListener("focus", handler)

    return () => {
      window.removeEventListener("focus", handler)
    }
  }, [listId])
}
