import React from "react"
import { noopTemplate as css } from "lib/utils"
import { useTheme } from "theme"

import { Fab } from "@material-ui/core"
import ListItem, { ListItemProps } from "@material-ui/core/ListItem"
import ListItemIcon, { ListItemIconProps } from "@material-ui/core/ListItemIcon"

import { ListItemText } from "lib/components"

import { AssignmentIcon } from "lib/icons"

export type TaskProps = ListItemProps & {
  IconProps?: Omit<ListItemIconProps, "children">

  task: Task
  multiselect: boolean
  backgroundColor?: string

  onSelectTask?: (id: ID) => void
  onItemClick?: (id: ID) => void
}

export default ({
  backgroundColor = "transparent",

  task,
  multiselect,

  onSelectTask = () => {},
  onItemClick = () => {},
  selected,

  IconProps,
  ...listItemProps
}: TaskProps) => {
  const theme = useTheme()

  return (
    <ListItem
      css={css`
        position: relative;
        min-height: 70px;
      `}
      style={{ ...listItemProps.style, backgroundColor }}
      button={true as any}
      selected={selected}
      {...(listItemProps as ListItemProps)}
      onClick={(event) => {
        onItemClick(task.id)
        listItemProps.onClick?.(event)
      }}
    >
      <ListItemIcon
        {...IconProps}
        onPointerDown={(event) => {
          event.stopPropagation()
          IconProps?.onPointerDown?.(event)
        }}
        onMouseDown={(event) => {
          event.stopPropagation()
          IconProps?.onMouseDown?.(event)
        }}
        onTouchStart={(event) => {
          event.stopPropagation()
          IconProps?.onTouchStart?.(event)
        }}
        onClick={(event) => {
          event.stopPropagation()
          onSelectTask(task.id)
          IconProps?.onClick?.(event)
        }}
      >
        <Fab
          style={{
            borderRadius: multiselect ? "50%" : "5px",
            transition: "300ms",
            border: selected ? "1px solid blue" : "none",
            background: theme.backgroundFadedColor,
            marginLeft: 4,
          }}
          size="small"
        >
          <AssignmentIcon
            style={{
              color: theme.iconColor,
              transform: `scale(${multiselect ? 0.7 : 1})`,
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
              maxWidth: "100%",
              display: "inline-block",
              fontSize: "0.95rem",
              textDecoration: task.complete ? "line-through" : "none",
            }}
          >
            {task.title}
          </span>
        }
        secondary={
          task.notes ? (
            <span
              className="ellipsis bold"
              style={{
                maxWidth: "100%",
                display: "inline-block",
                textDecoration: task.complete ? "line-through" : "none",
              }}
            >
              {task.notes}
            </span>
          ) : undefined
        }
      />
    </ListItem>
  )
}
