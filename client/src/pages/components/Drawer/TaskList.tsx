import React, { useState } from "react"
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core"

import { MoreVert } from "@material-ui/icons"

type Props = {
  taskList: TaskList
  selected: boolean
  onBodyClick: (id: ID) => void
  onDelete: (id: ID) => void
  onRename: (id: ID) => void
  onMakePrimary?: (id: ID) => void
}

export default ({
  taskList,
  selected,
  onDelete,
  onRename,
  onMakePrimary = () => {},
  onBodyClick,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null as HTMLElement | null)

  const totalTasks =
    taskList.numberOfCompleteTasks + taskList.numberOfIncompleteTasks

  return (
    <ListItem
      selected={selected}
      button
      onClick={() => onBodyClick(taskList.id)}
    >
      <ListItemText
        primary={taskList.name}
        secondary={
          totalTasks > 0
            ? `${taskList.numberOfCompleteTasks}/${totalTasks} tasks complete`
            : "No tasks"
        }
      />
      <ListItemSecondaryAction>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              onRename(taskList.id)
            }}
          >
            Rename
          </MenuItem>

          {!taskList.primary && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null)
                onMakePrimary(taskList.id)
              }}
            >
              Make Primary
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              onDelete(taskList.id)
              setAnchorEl(null)
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
