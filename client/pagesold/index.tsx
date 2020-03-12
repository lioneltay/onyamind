import React from "react"
import { styled } from "theme"

// import RootPage from "./Page"
// import ListPage from "./lists"
// import TrashPage from "./trash"

import { Route, Switch, Redirect } from "react-router-dom"
// import SandboxPage from "features/sandbox"

import Header from "./components/Header"
// import UndoSnackbar from "./components/UndoSnackbar"

// import { ThemeProvider } from "theme"

const Container = styled.div`
  background: ${({ theme }) => theme.background_faded_color};
  min-height: 100vh;
`

const RootRoute: React.FunctionComponent = () => {
  return (
    <Container>
      {/* <Header /> */}
      {/* <Drawer /> */}
      {/* <UndoSnackbar /> */}

      {/* <Switch>
          <Route exact path="/" component={RootPage} />} />
          <Route exact path="/lists/:list_id/:list_name" component={ListPage} />
          <Route exact path="/trash" component={TrashPage} />
          <Route exact path="/sandbox" component={SandboxPage} />
          <Route render={() => <Redirect to="/" />} />
        </Switch> */}
    </Container>
  )
}

// export default RootRoute

export default () => {
  return <h1>Root</h1>
}
