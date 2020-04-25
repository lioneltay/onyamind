import React from "react"
import { noopTemplate as css } from "lib/utils"
import { useTheme } from "theme"

import { Fab } from "@material-ui/core"
import ListItem, { ListItemProps } from "@material-ui/core/ListItem"
import ListItemIcon, { ListItemIconProps } from "@material-ui/core/ListItemIcon"
import Dotdotdot from "react-dotdotdot"

import { ListItemText } from "lib/components"

import { AssignmentIcon } from "lib/icons"

export type TaskProps = ListItemProps & {
  IconProps?: Omit<ListItemIconProps, "children">

  task: Task
  multiselect: boolean
  backgroundColor?: string

  onSelectTask?: (id: ID) => void
  onItemClick?: (id: ID) => void

  SelectIcon?: React.ComponentType<Stylable>
}

export default ({
  backgroundColor = "transparent",

  task,
  multiselect,

  onSelectTask = () => {},
  onItemClick = () => {},
  selected,

  IconProps,
  SelectIcon = AssignmentIcon,
  ...listItemProps
}: TaskProps) => {
  const theme = useTheme()

  return (
    <div
      style={{
        backgroundColor: theme.backgroundFadedColor,
      }}
    >
      <ListItem
        divider
        css={css`
          position: relative;
        `}
        button={true as any}
        selected={selected}
        {...(listItemProps as ListItemProps)}
        style={{ ...listItemProps.style, backgroundColor }}
        onClick={(event) => {
          onItemClick(task.id)
          listItemProps.onClick?.(event)
        }}
      >
        <ListItemIcon
          {...IconProps}
          // onPointerDown={(event) => {
          //   event.stopPropagation()
          //   IconProps?.onPointerDown?.(event)
          // }}
          // onMouseDown={(event) => {
          //   event.stopPropagation()
          //   IconProps?.onMouseDown?.(event)
          // }}
          // onTouchStart={(event) => {
          //   event.stopPropagation()
          //   IconProps?.onTouchStart?.(event)
          // }}
          onClick={(event) => {
            event.stopPropagation()
            onSelectTask(task.id)
            IconProps?.onClick?.(event)
          }}
        >
          <Fab
            style={{
              borderRadius: "50%",
              transition: "300ms",
              border: selected ? "1px solid blue" : "none",
              background: theme.backgroundFadedColor,
              marginLeft: 4,
            }}
            size="small"
          >
            <SelectIcon
              style={{
                color: theme.iconColor,
                transform: `scale(0.8)`,
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
              <Dotdotdot
                tagName="span"
                clamp={2}
                className="bold"
                css={css`
                  max-width: 100%;
                  display: inline-block;
                  text-decoration: ${task.complete ? "line-through" : "none"};
                  white-space: pre-wrap;
                `}
              >
                {task.notes}
              </Dotdotdot>
            ) : undefined
          }
        />
      </ListItem>
    </div>
  )
}
