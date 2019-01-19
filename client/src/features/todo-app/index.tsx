import React from "react"

import { Provider as StateProvider, useAppState } from "./state"
import { Flipper } from "react-flip-toolkit"
import { partition, prop, comparator } from "ramda"

import Root from "./Root"
import { Task } from "./types"

const RootWithContext: React.FunctionComponent = () => {
  const { tasks } = useAppState()

  const [complete, incomplete] = partition(task => task.complete, tasks)
  const process = (tasks: Task[]) =>
    tasks
      .sort(comparator((t1, t2) => t1.created_at > t2.created_at))
      .map(prop("id"))

  const flipKey =
    [...process(incomplete), ...process(complete)].join("") +
    complete.length +
    incomplete.length

  return (
    <Flipper flipKey={flipKey}>
      <Root />
    </Flipper>
  )
}

const TodoApp: React.FunctionComponent = () => {
  return (
    <StateProvider>
      <RootWithContext />
    </StateProvider>
  )
}

export default TodoApp
