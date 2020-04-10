import React from "react"
import { IconButton } from "@material-ui/core"
import PopoverMenu from "./PopoverMenu"

type IconButtonMenu = {
  icon: React.ReactNode
  items: {
    label: string
    action?: () => void
  }[]
}

const IconButtonMenu: React.FunctionComponent<IconButtonMenu> = ({
  icon,
  items,
}) => {
  return (
    <PopoverMenu items={items}>
      {({ setAnchorEl }) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            setAnchorEl(e.currentTarget)
          }}
        >
          {icon}
        </IconButton>
      )}
    </PopoverMenu>
  )
}

export default IconButtonMenu
