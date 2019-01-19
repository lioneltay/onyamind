import React, { useState, Fragment } from "react"
import styled from "styled-components"
import { Task } from "./types"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { grey_text } from "./constants"
import TaskList from "./TaskList"
import IconButton from "@material-ui/core/IconButton"
import ExpandMore from "@material-ui/icons/ExpandMore"
import MoreVert from "@material-ui/icons/MoreVert"
import { useAppState } from "./state"

const Rotate = styled.div.attrs({})<{ rotate: boolean }>`
  transform: rotate(${({ rotate }) => (rotate ? "-180deg" : "0")});
  transition: 300ms;
`

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 0fr 1fr 0fr;
  align-items: center;
  padding-left: 8px;
  color: ${grey_text};
`

const Text = styled.div`
  padding: 0 18px;
  cursor: pointer;
`

type Props = { tasks: Task[] }

const Toggler: React.FunctionComponent<Props> = ({ tasks }) => {
  const [show, setShow] = useState(false)
  const [anchor_el, setAnchorEl] = useState(null as HTMLElement | null)
  const {
    actions: { uncheckCompletedTasks, deleteCompletedTasks },
  } = useAppState()

  return (
    <Fragment>
      <RowContainer>
        <Rotate rotate={show}>
          <IconButton onClick={() => setShow(show => !show)}>
            <ExpandMore />
          </IconButton>
        </Rotate>
        <Text onClick={() => setShow(show => !show)}>
          {tasks.length} checked off
        </Text>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchor_el}
          open={!!anchor_el}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              uncheckCompletedTasks()
              setAnchorEl(null)
            }}
          >
            Uncheck all items
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteCompletedTasks()
              setAnchorEl(null)
            }}
          >
            Delete completed items
          </MenuItem>
        </Menu>
      </RowContainer>

      {show ? <TaskList tasks={tasks.filter(task => task.complete)} /> : null}
    </Fragment>
  )
}

export default Toggler
