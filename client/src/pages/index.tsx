import React from "react"
import styled from "styled-components"
import { Route, Switch, Redirect } from "react-router-dom"

import TodoAppPage from "features/todo-app"
import SandboxPage from "features/sandbox"

const Container = styled.main``

export default class Root extends React.Component {
  render() {
    return (
      <Container>
        <Switch>
          <Route exact path="/" component={TodoAppPage} />
          <Route exact path="/sandbox" component={SandboxPage} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Container>
    )
  }
}
