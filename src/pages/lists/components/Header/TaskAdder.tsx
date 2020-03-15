import React, { Fragment, useState } from "react"
import { noopTemplate as css } from "lib/utils"
import { useTheme, styled } from "theme"
import { useMediaQuery } from "@tekktekk/react-media-query"
import { MOBILE_WIDTH } from "config"

import { Add, Clear, Mic } from "@material-ui/icons"

import {
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core"

import { useSelector, useActions } from "services/store"

import CreateTaskModal from "./CreateTaskModal"

const OuterContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Container = styled(List)`
  max-width: 600px;
  width: 100%;
  padding: 0;
` as typeof List

export default () => {
  const theme = useTheme()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const {
    listPage: {
      stopEditingTask,
      deselectIncompleteTasks,
      selectIncompleteTasks,
      createTask,
    },
  } = useActions()

  const {
    selectedTaskIds,
    tasks,
    multiselect,
    selectedTaskListId,
    userId,
  } = useSelector((state, s) => ({
    selectedTaskIds: state.listPage.selectedTaskIds,
    tasks: s.listPage.tasks(state),
    multiselect: state.listPage.multiselect,
    selectedTaskListId: state.listPage.selectedTaskListId,
    userId: state.auth.user?.uid,
  }))

  const allSelected = !!(
    selectedTaskIds.length !== 0 &&
    tasks &&
    tasks
      .filter(task => !task.complete)
      .every(task => selectedTaskIds.includes(task.id))
  )

  const mobile = useMediaQuery(`(max-width: ${MOBILE_WIDTH}px)`)

  return (
    <Fragment>
      <OuterContainer
        style={{
          paddingTop: mobile ? 0 : 24,
          background: theme.backgroundFadedColor,
        }}
      >
        <Container
          style={{
            height: 57,
            background: multiselect
              ? theme.backgroundFadedColor
              : theme.backgroundColor,
          }}
        >
          {multiselect ? (
            <ListItem
              button
              className="py-0"
              style={{
                height: 57,
              }}
              divider
              onClick={
                allSelected ? deselectIncompleteTasks : selectIncompleteTasks
              }
            >
              <ListItemIcon>
                <Checkbox color="primary" checked={allSelected} />
              </ListItemIcon>
              <ListItemText className="cursor-pointer">
                <span
                  style={{
                    color: theme.highlightedTextColor,
                    fontWeight: 500,
                  }}
                >
                  {allSelected ? "DESELECT ALL" : "SELECT ALL"}
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
                <IconButton onClick={() => setShowCreateModal(true)}>
                  <Add />
                </IconButton>
              </ListItemIcon>

              <TextField
                css={css`
                  & fieldset {
                    border: none;
                  }
                `}
                variant="outlined"
                onFocus={stopEditingTask}
                placeholder="Add item"
                className="fg-1"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.currentTarget.value)}
                onKeyPress={e => {
                  if (e.key === "Enter" && newTaskTitle.length > 0) {
                    setNewTaskTitle("")
                    createTask({ title: newTaskTitle })
                  }
                }}
                inputProps={{
                  style: { paddingLeft: 0 },
                }}
                InputProps={{
                  style: { paddingRight: 0 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setNewTaskTitle("")}>
                        {newTaskTitle ? <Clear /> : <Mic />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>
          )}
        </Container>
      </OuterContainer>

      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialValues={{
          title: newTaskTitle,
        }}
        onSubmit={async values => {
          setShowCreateModal(false)
          setNewTaskTitle("")
          await createTask({ ...values })
        }}
      />
    </Fragment>
  )
}
