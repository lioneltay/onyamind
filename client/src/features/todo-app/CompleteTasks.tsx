import React, { useState, Fragment } from "react"
import styled from "styled-components"
import { Task } from "./types"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { grey_text } from "./constants"
import TaskList from "./TaskList"
import { IconButton } from "./widgets"
import { useAppState } from "./state"

const Icon = styled(IconButton).attrs({
  className: "fas fa-chevron-down",
})<{ rotate: boolean }>`
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
        <Icon rotate={show} onClick={() => setShow(show => !show)} />
        <Text onClick={() => setShow(show => !show)}>
          {tasks.length} checked off
        </Text>
        <IconButton
          className="fas fa-ellipsis-v"
          onClick={e => setAnchorEl(e.currentTarget)}
        />
        <Menu
          anchorEl={anchor_el}
          open={!!anchor_el}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
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
