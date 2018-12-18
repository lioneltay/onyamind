import React from "react"
import styled from "styled-components"
import { Route, Switch } from "react-router-dom"

import { URLBreadcrumbs } from "lib/components"

import Header from "./@src/Header"

import Home from "pages/home"
import Sandbox from "pages/sandbox"

const Container = styled.main``

export default class Root extends React.Component {
  render() {
    return (
      <Container>
        <Header />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route path="/sandbox" component={Sandbox} />
          <Route render={() => <URLBreadcrumbs className="m-2" />} />
        </Switch>
      </Container>
    )
  }
}
