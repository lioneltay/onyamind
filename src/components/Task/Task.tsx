import React from "react"
import { noopTemplate as css, noop } from "lib/utils"
import { useTheme } from "theme"

import { Fab } from "@material-ui/core"
import ListItem, { ListItemProps } from "@material-ui/core/ListItem"
import ListItemIcon, { ListItemIconProps } from "@material-ui/core/ListItemIcon"
import Dotdotdot from "react-dotdotdot"

import { ListItemText } from "lib/components"

import { AssignmentIcon } from "lib/icons"

export type TaskProps = ListItemProps & {
  id: ID
  title: string
  notes?: string
  complete?: boolean
  IconProps?: Omit<ListItemIconProps, "children">

  backgroundColor?: string

  onSelectTask?: (id: ID) => void
  onItemClick?: (id: ID) => void

  SelectIcon?: React.ComponentType<Stylable>
}

const Task = ({
  id,
  title,
  notes,
  complete,

  backgroundColor = "transparent",

  onSelectTask = noop,
  onItemClick = noop,
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
          onItemClick(id)
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
            onSelectTask(id)
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
                textDecoration: complete ? "line-through" : "none",
              }}
            >
              {title}
            </span>
          }
          secondary={
            notes ? (
              <Dotdotdot
                tagName="span"
                clamp={2}
                className="bold"
                css={css`
                  max-width: 100%;
                  display: inline-block;
                  text-decoration: ${complete ? "line-through" : "none"};
                  white-space: pre-wrap;
                `}
              >
                {notes}
              </Dotdotdot>
            ) : undefined
          }
        />
      </ListItem>
    </div>
  )
}

export default React.memo(Task)
