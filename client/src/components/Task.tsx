import React from "react"
import { styled } from "theme"
import { useTheme } from "theme"

import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Fab from "@material-ui/core/Fab"

import Assignment from "@material-ui/icons/Assignment"

import { ListItemText } from "@material-ui/core"
import { connect } from "services/state"

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

export type Props = Stylable & {
  theme: Theme
  selected: boolean
  task: Task
  editing: boolean

  onSelectTask?: (id: ID) => void
  onItemClick?: (id: ID) => void

  hoverActions?: React.ReactNode
  actions?: React.ReactNode
}

const Task: React.FunctionComponent<Props> = ({
  style,
  className,

  selected,
  task,
  editing,

  onSelectTask = () => {},
  onItemClick = () => {},

  actions,
  hoverActions,
}) => {
  const theme = useTheme()

  return (
    <StyledListItem
      style={style}
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
            background: theme.background_faded_color,
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
              color: theme.mui.palette.primary.main,
              color: theme.icon_color,
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
      />

      <Overlay onClick={e => e.stopPropagation()}>{hoverActions}</Overlay>

      <div onClick={e => e.stopPropagation()}>{actions}</div>
    </StyledListItem>
  )
}
