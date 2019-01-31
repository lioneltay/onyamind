import React from "react"
import styled from "styled-components"

import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Fab from "@material-ui/core/Fab"

import Assignment from "@material-ui/icons/Assignment"

import { highlight_color } from "theme"
import { ListItemText } from "@material-ui/core"

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

const SingleLineWithEllipsis: React.FunctionComponent<Stylable> = ({
  className,
  style,
  children,
}) => {
  return (
    <span className="flex">
      <span
        className={className}
        style={{
          ...style,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </span>
    </span>
  )
}

export type Props = {
  selected: boolean
  task: Task
  editing: boolean

  onSelectTask?: (id: ID) => void
  onItemClick?: (id: ID) => void

  hoverActions?: React.ReactNode
  actions?: React.ReactNode
}

const Task: React.FunctionComponent<Props> = ({
  selected,
  task,
  editing,

  onSelectTask = () => {},
  onItemClick = () => {},

  actions,
  hoverActions,
}) => {
  return (
    <StyledListItem
      style={{
        opacity: 1,
        height: "auto",
        backgroundColor: selected ? highlight_color : undefined,
      }}
      selected={selected}
      button
    >
      <ListItemIcon>
        <Fab
          style={{
            borderRadius: editing ? "50%" : "5px",
            transition: "300ms",
            border: selected ? "1px solid blue" : "none",
            background: "white",
            marginLeft: 4,
            color: "#ccc",
          }}
          onClick={() => onSelectTask(task.id)}
          size="small"
        >
          <Assignment
            style={{
              transform: `scale(${editing ? 0.7 : 1})`,
              transition: "300ms",
            }}
          />
        </Fab>
      </ListItemIcon>

      <ListItemText
        primary={
          <SingleLineWithEllipsis
            style={{
              fontWeight: 500,
              fontSize: "0.95rem",
              textDecoration: task.complete ? "line-through" : "none",
              color: "#202124",
            }}
          >
            {task.title}
          </SingleLineWithEllipsis>
        }
        secondary={
          <SingleLineWithEllipsis style={{ fontWeight: 500 }}>
            {task.notes}
          </SingleLineWithEllipsis>
        }
        onClick={() => onItemClick(task.id)}
      />

      <Overlay>{hoverActions}</Overlay>

      {actions}
    </StyledListItem>
  )
}

export default Task
