import React, { useState } from "react"
import { styled } from "theme"
import { useMediaQuery } from "@tekktekk/react-media-query"

import Add from "@material-ui/icons/Add"
import Clear from "@material-ui/icons/Clear"
import CheckBox from "@material-ui/icons/CheckBox"
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"

import Checkbox from "@material-ui/core/Checkbox"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"

import {
  selectAllIncompleteTasks,
  deselectAllIncompleteTasks,
} from "services/state/modules/editing"
import { connect } from "services/state"
import { addTask } from "services/state/modules/tasks"

const OuterContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.background_faded_color};
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

type Props = {
  theme: Theme
  tasks: Task[]
  user: User
  editing: boolean
  selected_task_ids: ID[]
  selected_task_list_id: ID | null
}

const TaskAdder: React.FunctionComponent<Props> = ({
  editing,
  selected_task_ids,
  tasks,
  theme,
}) => {
  const [new_task_title, setNewTaskTitle] = useState("")

  const handleIt = () => {
    if (new_task_title.length === 0) {
      return
    }

    setNewTaskTitle("")
    addTask(new_task_title)
  }

  const all_selected =
    selected_task_ids.length !== 0 &&
    tasks &&
    tasks
      .filter(task => !task.complete)
      .every(task => selected_task_ids.includes(task.id))

  const mobile = useMediaQuery("(max-width: 800px)")

  return (
    <OuterContainer style={{ paddingTop: mobile ? 0 : 24 }}>
      <Container
        style={{
          height: 57,
          background: editing
            ? theme.background_faded_color
            : theme.background_color,
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
              <Checkbox color="primary" checked={all_selected} />
            </ListItemIcon>
            <ListItemText className="cursor-pointer">
              <span
                style={{
                  color: theme.highlighted_text_color,
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

export default connect(state => ({
  theme: state.settings.theme,
  user: state.user,
  editing: state.editing,
  selected_task_ids: state.selected_task_ids,
  tasks: state.tasks,
  selected_task_list_id: state.selected_task_list_id,
}))(TaskAdder)
