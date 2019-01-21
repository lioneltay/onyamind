import React, { Fragment } from "react"
import styled from "styled-components"
import { useMediaQuery } from "@tekktekk/react-media-query"

import Add from "@material-ui/icons/Add"
import Clear from "@material-ui/icons/Clear"
import CheckBox from "@material-ui/icons/CheckBox"
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
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
    tasks,
    selected_task_ids,
    actions: {
      selectAllIncompleteTasks,
      deselectAllIncompleteTasks,
      setNewTaskTitle,
      addTask,
    },
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

  const all_selected =
    selected_task_ids.length !== 0 &&
    tasks &&
    tasks
      .filter(task => !task.complete)
      .every(task => selected_task_ids.includes(task.id))
  // selected_task_ids.every(id => !!tasks.find(task => task.id === id))

  console.log(selected_task_ids, all_selected)

  const mobile = useMediaQuery("(max-width: 800px)")

  return (
    <OuterContainer style={{ paddingTop: mobile ? 0 : 24 }}>
      <Container
        style={{
          height: 57,
          background: editing ? background_color : "white",
        }}
      >
        {editing ? (
          <ListItem
            button
            className="py-0"
            style={{
              height: 57,
            }}
            divider
            onClick={
              all_selected
                ? deselectAllIncompleteTasks
                : selectAllIncompleteTasks
            }
          >
            <ListItemIcon>
              <IconButton>
                {all_selected ? <CheckBox /> : <CheckBoxOutlineBlank />}
              </IconButton>
            </ListItemIcon>
            <ListItemText className="cursor-pointer">
              <span
                style={{
                  color: highlighted_text_color,
                  fontWeight: 500,
                }}
              >
                {all_selected ? "DESELECT ALL" : "SELECT ALL"}
              </span>
            </ListItemText>
          </ListItem>
        ) : (
          <ListItem
            className="py-0"
            style={{
              height: 57,
            }}
            divider
          >
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
              InputProps={{
                style: { paddingRight: 0 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setNewTaskTitle("")}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        )}
      </Container>
    </OuterContainer>
  )
}

export default TaskAdder
