import React from "react"

import { Provider as StateProvider } from "../services/state/oldappstate"
import { Flipper } from "react-flip-toolkit"
import { partition, prop, comparator } from "ramda"

import Root from "./Root"
import { Task } from "../types"

import { Provider as RxStateProvider, connect } from "../services/state"
import { Route, Switch, Redirect } from "react-router-dom"
import SandboxPage from "features/sandbox"

type RootWithContextProps = {
  tasks: Task[]
}
const RootWithContext: React.FunctionComponent<RootWithContextProps> = ({
  tasks,
}) => {
  if (!tasks) {
    return (
      <Flipper flipKey="No tasks">
        <Root />
      </Flipper>
    )
  }

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

const ConnectedRootWithContext = connect(
  state => ({ tasks: state.tasks }),
  {},
)(RootWithContext)

const TodoApp: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <RxStateProvider>
            <StateProvider>
              <ConnectedRootWithContext />
            </StateProvider>
          </RxStateProvider>
        )}
      />
      <Route exact path="/sandbox" component={SandboxPage} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  )
}

export default TodoApp
