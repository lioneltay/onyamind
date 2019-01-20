import React, { Fragment } from "react"
import styled from "styled-components"

import { HEIGHT as HEADER_HEIGHT } from "./Header"
import Add from "@material-ui/icons/Add"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import { background_color, highlighted_text_color } from "../constants"
import { useAppState } from "../state"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"

const PADDING_TOP = 24
const CONTENT_HEIGHT = 70
export const HEIGHT = CONTENT_HEIGHT + PADDING_TOP

const OuterContainer = styled.div`
  position: fixed;
  z-index: 1000;
  background: ${background_color};
  top: ${HEADER_HEIGHT}px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: ${PADDING_TOP}px;
  height: ${HEIGHT}px;
`

const Container = styled(List)`
  height: ${CONTENT_HEIGHT}px;
  max-width: 600px;
  width: 100%;
  padding: 0;
` as typeof List

const AdderTextField = styled(TextField).attrs({ variant: "outlined" })`
  & fieldset {
    border: none;
  }
` as typeof TextField

const TaskAdder: React.FunctionComponent = () => {
  const {
    editing,
    new_task_title,
    user,
    actions: { selectAllIncompleteTasks, setNewTaskTitle, addTask },
  } = useAppState()

  const handleIt = () => {
    if (new_task_title.length === 0) {
      return
    }

    setNewTaskTitle("")
    addTask({
      title: new_task_title,
      notes: "",
      user_id: user ? user.uid : null,
    })
  }

  return (
    <Fragment>
      <div style={{ height: HEIGHT }} />
      <OuterContainer>
        <Container>
          <ListItem
            className="py-0"
            style={{
              height: CONTENT_HEIGHT,
              background: editing ? background_color : "white",
            }}
            divider
          >
            {editing ? (
              <ListItemText
                className="cursor-pointer"
                onClick={selectAllIncompleteTasks}
              >
                <span
                  style={{
                    height: CONTENT_HEIGHT,
                    color: highlighted_text_color,
                    fontWeight: 500,
                  }}
                >
                  Select All
                </span>
              </ListItemText>
            ) : (
              <Fragment>
                <ListItemIcon>
                  <IconButton onClick={handleIt}>
                    <Add />
                  </IconButton>
                </ListItemIcon>

                <AdderTextField
                  placeholder="Add item"
                  className="fg-1"
                  value={new_task_title}
                  onChange={e => setNewTaskTitle(e.currentTarget.value)}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      handleIt()
                    }
                  }}
                />
              </Fragment>
            )}
          </ListItem>
        </Container>
      </OuterContainer>
    </Fragment>
  )
}

export default TaskAdder
