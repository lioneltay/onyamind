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
import Add from "@material-ui/icons/Add"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import GoogleSignInButton from "../components/GoogleSignInButton"

import { Task } from "../types"

const Container = styled(Toolbar)`
  padding-left: 0;
  padding-right: 0;
  display: flex;
  justify-content: center;
` as typeof Toolbar

const Main = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  max-width: 100%;
  width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    selected_task_ids,
    tasks,
    selected_task_list_id,
    task_lists,

    actions: {
      signOut,
      signInWithGoogle,
      checkSelectedTasks,
      uncheckSelectedTasks,
      deleteSelectedTasks,
      stopEditing,
      setShowDrawer,
    },
  } = useAppState()

  const selected_task_list = task_lists
    ? task_lists.find(list => list.id === selected_task_list_id)
    : null

  const selected_tasks = tasks
    ? (selected_task_ids
        .map(id => tasks.find(task => task.id === id))
        .filter(task => !!task) as Task[])
    : []
  const all_complete = selected_tasks.every(task => task.complete)
  const all_incomplete = selected_tasks.every(task => !task.complete)

  return (
    <AppBar position="relative">
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
                  {selected_task_ids.length} selected
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
              {all_complete || all_incomplete ? (
                <IconButton
                  onClick={
                    all_incomplete ? checkSelectedTasks : uncheckSelectedTasks
                  }
                >
                  {all_incomplete ? <Check /> : <Add />}
                </IconButton>
              ) : null}

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
}

export default Header
