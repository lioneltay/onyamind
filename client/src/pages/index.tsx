import React from "react"
import styled from "styled-components"

import RootPage from "./Page"
import ListPage from "./lists"
import TrashPage from "./trash"

import { Provider as RxStateProvider } from "../services/state"
import { Route, Switch, Redirect } from "react-router-dom"
import SandboxPage from "features/sandbox"

import { background_color } from "theme"

import Header from "./components/Header"
import Drawer from "./components/Drawer"

const Container = styled.div`
  background: ${background_color};
  min-height: 100vh;
`

const StickySection = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
`

const RootRoute: React.FunctionComponent = () => {
  return (
    <RxStateProvider>
      <Container>
        <Header />
        <Drawer />

        <Switch>
          <Route exact path="/" component={RootPage} />} />
          <Route exact path="/lists/:list_id/:list_name" component={ListPage} />
          <Route exact path="/trash" component={TrashPage} />
          <Route exact path="/sandbox" component={SandboxPage} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Container>
    </RxStateProvider>
  )
}

export default RootRoute
