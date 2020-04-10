import React from "react"
import { Menu, MenuItem } from "@material-ui/core"

type PopoverMenuProps = {
  children: (props: {
    setAnchorEl: (el: HTMLElement) => void
  }) => React.ReactNode
  items: {
    action?: () => void
    label: string
  }[]
}

const PopoverMenu = ({ items, children }: PopoverMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null as HTMLElement | null)

  return (
    <React.Fragment>
      {children({ setAnchorEl })}

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {items.map((config, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              config.action && config.action()
              setAnchorEl(null)
            }}
          >
            {config.label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}

export default PopoverMenu
