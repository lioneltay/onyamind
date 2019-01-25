import React, { useState } from "react"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

import MoreVert from "@material-ui/icons/MoreVert"


type Props = {
  task_list: TaskList
  selected: boolean
  onBodyClick: (id: ID) => void
  onDelete: (id: ID) => void
  onRename: (id: ID) => void
  onMakePrimary?: (id: ID) => void
}

const TaskList: React.FunctionComponent<Props> = ({
  task_list,
  selected,
  onDelete,
  onRename,
  onMakePrimary = () => {},
  onBodyClick,
}) => {
  const [anchor_el, setAnchorEl] = useState(null as HTMLElement | null)

  return (
    <ListItem
      selected={selected}
      button
      onClick={() => onBodyClick(task_list.id)}
    >
      <ListItemText
        primary={task_list.name}
        secondary={`${task_list.number_of_tasks} items`}
      />
      <ListItemSecondaryAction>
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
              setAnchorEl(null)
              onRename(task_list.id)
            }}
          >
            Rename
          </MenuItem>

          {!task_list.primary && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null)
                onMakePrimary(task_list.id)
              }}
            >
              Make Primary
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              onDelete(task_list.id)
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

export default TaskList
