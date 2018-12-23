import React from "react"
import styled from "styled-components"
import { Route, Switch } from "react-router-dom"

import { URLBreadcrumbs } from "lib/components"

import TaskListPage from "pages/tasklist"

const Container = styled.main``

export default class Root extends React.Component {
  render() {
    return (
      <Container>
        <Switch>
          <Route exact path="/" component={TaskListPage} />
          <Route path="/tasklist" component={TaskListPage} />
          <Route render={() => <URLBreadcrumbs className="m-2" />} />
        </Switch>
      </Container>
    )
  }
}
