import React, { useState, Fragment } from "react"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"

type IconButtonMenu = {
  icon: React.ReactNode
  items: { label: string; action: () => void }[]
}

const IconButtonMenu: React.FunctionComponent<IconButtonMenu> = ({
  icon,
  items,
}) => {
  const [anchor_el, setAnchorEl] = useState(null as HTMLElement | null)

  return (
    <Fragment>
      <IconButton
        onClick={e => {
          e.stopPropagation()
          setAnchorEl(e.currentTarget)
        }}
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchor_el}
        open={!!anchor_el}
        onClose={() => setAnchorEl(null)}
      >
        {items.map((config, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              config.action()
              setAnchorEl(null)
            }}
          >
            {config.label}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  )
}

export default IconButtonMenu
