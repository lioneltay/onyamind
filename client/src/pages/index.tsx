import React from "react"
import styled from "styled-components"
import { Route, Switch } from "react-router-dom"

import { URLBreadcrumbs } from "lib/components"

import { Page as TodoAppPage } from "features/todo-app"

const Container = styled.main``

export default class Root extends React.Component {
  componentDidMount() {
    document.querySelector('#app-shell')!.remove()
  }

  render() {
    return (
      <Container>
        <Switch>
          <Route exact path="/" component={TodoAppPage} />
          <Route path="/todo-app" component={TodoAppPage} />
          <Route render={() => <URLBreadcrumbs className="m-2" />} />
        </Switch>
      </Container>
    )
  }
}
