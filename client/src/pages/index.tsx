import React from "react"
import styled from "styled-components"
import { Route, Switch } from "react-router-dom"

import { URLBreadcrumbs } from "lib/components"

import TodoAppPage from "features/todo-app"
import ArithmeticAppPage from "features/arithmetic"
import Playground from "./Playground"

const Container = styled.main``

export default class Root extends React.Component {
  componentDidMount() {
    document.querySelector("#app-shell")!.remove()
  }

  render() {
    return (
      <Container>
        <Switch>
          <Route exact path="/" component={TodoAppPage} />
          <Route path="/todo-app" component={TodoAppPage} />
          <Route path="/arithmetic" component={ArithmeticAppPage} />
          <Route path="/playground" component={Playground} />
          <Route render={() => <URLBreadcrumbs className="m-2" />} />
        </Switch>
      </Container>
    )
  }
}
