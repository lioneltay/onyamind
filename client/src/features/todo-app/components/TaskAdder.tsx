import React, { Fragment } from "react"
import styled from "styled-components"
import { useMediaQuery } from "@tekktekk/react-media-query"

import Add from "@material-ui/icons/Add"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import { background_color, highlighted_text_color } from "../constants"
import { useAppState } from "../state"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"

const OuterContainer = styled.div`
  position: relative;
  background: ${background_color};
  width: 100%;
  display: flex;
  justify-content: center;
`

const Container = styled(List)`
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

  const mobile = useMediaQuery("(max-width: 800px)")

  return (
    <OuterContainer style={{ paddingTop: mobile ? 0 : 24 }}>
      <Container>
        <ListItem
          className="py-0"
          style={{
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
  )
}

export default TaskAdder
