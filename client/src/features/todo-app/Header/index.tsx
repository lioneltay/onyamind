import React, { Fragment } from "react"
import styled from "styled-components"
import { firebase } from "services/firebase"

import LoginWidget from "./LoginWidget"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/icons/Menu"
import ArrowBack from "@material-ui/icons/ArrowBack"
import Delete from "@material-ui/icons/Delete"
import Check from "@material-ui/icons/Check"
import { useAppState } from "../state"
import { highlight_color, highlighted_text_color } from "../constants"

export const HEIGHT = 64

const Placeholder = styled.div`
  height: ${HEIGHT}px;
`

const Container = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: center;
  height: ${HEIGHT}px;

  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  background: white;
`

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

type Props = {}

const Header: React.FunctionComponent<Props> = () => {
  const {
    user,
    editing,
    selected_tasks,
    actions: { checkSelectedTasks, deleteSelectedTasks, stopEditing },
  } = useAppState()

  return (
    <Fragment>
      <Placeholder />

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
                <IconButton style={{ display: "inline-block" }}>
                  <Menu />
                </IconButton>
                <div style={{ paddingLeft: 18 }}>Tasks</div>
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
            <Button
              variant="outlined"
              color="primary"
              onClick={() => firebase.auth().signOut()}
            >
              Logout
            </Button>
          ) : (
            <LoginWidget />
          )}
        </Main>
      </Container>
    </Fragment>
  )
}

export default Header
