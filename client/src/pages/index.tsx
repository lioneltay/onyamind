import React from "react"

import Root from "./Root"

import { Provider as RxStateProvider, connect } from "../services/state"
import { Route, Switch, Redirect } from "react-router-dom"
import SandboxPage from "features/sandbox"

const ConnectedRoot = connect(
  state => ({ tasks: state.tasks }),
  {},
)(Root)

const TodoApp: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <RxStateProvider>
            <ConnectedRoot />
          </RxStateProvider>
        )}
      />
      <Route exact path="/sandbox" component={SandboxPage} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  )
}

export default TodoApp
