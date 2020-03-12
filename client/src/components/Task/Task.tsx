import React from "react"
import { noopTemplate as css } from "lib/utils"
import { styled } from "theme"
import { useTheme } from "theme"

import { ListItem, ListItemIcon, Fab } from "@material-ui/core"

import { ListItemText } from "lib/components"

import { Assignment } from "@material-ui/icons"

const StyledListItem = styled(ListItem)`
  position: relative;
  min-height: 70px;
` as any

const Overlay = styled.div`
  opacity: 0;
  pointer-events: none;
  display: none;

  body.hasHover ${StyledListItem}:hover & {
    display: flex;
    opacity: 1;
    pointer-events: all;
  }
`

export type TaskProps = Stylable & {
  selected: boolean
  task: Task
  editing: boolean
  backgroundColor?: string

  onSelectTask?: (id: ID) => void
  onItemClick?: (id: ID) => void

  hoverActions?: React.ReactNode
}

export default ({
  style,
  className,

  backgroundColor = "transparent",

  selected,
  task,
  editing,

  onSelectTask = () => {},
  onItemClick = () => {},

  hoverActions,
}: TaskProps) => {
  const theme = useTheme()

  return (
    <StyledListItem
      style={{ ...style, backgroundColor }}
      className={className}
      selected={selected}
      button
      onClick={() => onItemClick(task.id)}
    >
      <ListItemIcon>
        <Fab
          style={{
            borderRadius: editing ? "50%" : "5px",
            transition: "300ms",
            border: selected ? "1px solid blue" : "none",
            background: theme.backgroundFadedColor,
            marginLeft: 4,
          }}
          onClick={e => {
            e.stopPropagation()
            onSelectTask(task.id)
          }}
          size="small"
        >
          <Assignment
            style={{
              color: theme.iconColor,
              transform: `scale(${editing ? 0.7 : 1})`,
              transition: "300ms",
            }}
          />
        </Fab>
      </ListItemIcon>

      <ListItemText
        primary={
          <span
            className="ellipsis bold"
            style={{
              fontSize: "0.95rem",
              textDecoration: task.complete ? "line-through" : "none",
            }}
          >
            {task.title}
          </span>
        }
        secondary={<span className="ellipsis bold">{task.notes}</span>}
      />

      <Overlay onClick={e => e.stopPropagation()}>{hoverActions}</Overlay>
    </StyledListItem>
  )
}
