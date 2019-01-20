import React, { Fragment } from "react"
import styled from "styled-components"

import { useAppState } from "../state"
import { highlight_color, highlighted_text_color } from "../constants"

import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/icons/Menu"
import ArrowBack from "@material-ui/icons/ArrowBack"
import Delete from "@material-ui/icons/Delete"
import Check from "@material-ui/icons/Check"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import GoogleSignInButton from "../components/GoogleSignInButton"

export const HEIGHT = 64

const Placeholder = styled.div`
  height: ${HEIGHT}px;
`

const Container = styled(Toolbar)`
  z-index: 2000;
  display: flex;
  justify-content: center;
` as typeof Toolbar

const Main = styled.div`
  max-width: 100%;
  width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
`

const Header: React.FunctionComponent = () => {
  const {
    user,
    editing,
    selected_tasks,
    selected_task_list_id,
    task_lists,

    actions: {
      signOut,
      signInWithGoogle,
      checkSelectedTasks,
      deleteSelectedTasks,
      stopEditing,
      setShowDrawer,
    },
  } = useAppState()

  const selected_task_list = task_lists
    ? task_lists.find(list => list.id === selected_task_list_id)
    : null

  const header_jsx = (
    <AppBar>
      <Container
        style={{
          backgroundColor: editing ? highlight_color : "white",
        }}
      >
        <Main>
          <LeftSection>
            {editing ? (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  onClick={stopEditing}
                >
                  <ArrowBack />
                </IconButton>
                <div style={{ color: highlighted_text_color, paddingLeft: 18 }}>
                  {selected_tasks.length} selected
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  onClick={() => setShowDrawer(true)}
                >
                  <Menu />
                </IconButton>
                <div style={{ paddingLeft: 18, color: "black" }}>
                  {selected_task_list ? selected_task_list.name : ""}
                </div>
              </Fragment>
            )}
          </LeftSection>

          {editing ? (
            <div style={{ display: "flex" }}>
              <IconButton onClick={checkSelectedTasks}>
                <Check />
              </IconButton>

              <IconButton onClick={deleteSelectedTasks}>
                <Delete />
              </IconButton>
            </div>
          ) : user && user.uid ? (
            <Button variant="outlined" color="primary" onClick={signOut}>
              Logout
            </Button>
          ) : (
            <GoogleSignInButton onClick={signInWithGoogle} />
          )}
        </Main>
      </Container>
    </AppBar>
  )

  return (
    <Fragment>
      <Placeholder />
      {header_jsx}
    </Fragment>
  )
}

export default Header
