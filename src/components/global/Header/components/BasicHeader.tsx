import React from "react"
import { noopTemplate as css } from "lib/utils"

import { MenuIcon } from "lib/icons"
import { Toolbar, AppBar, IconButton } from "@material-ui/core"

import { useActions } from "services/store"

export default () => {
  const {
    ui: { toggleDrawer },
  } = useActions()

  return (
    <AppBar
      position="relative"
      component="header"
      css={css`
        position: sticky;
        top: 0;
        z-index: 1000;
      `}
    >
      <Toolbar
        css={css`
          padding-left: 0;
          padding-right: 0;
          display: flex;
          justify-content: center;
        `}
      >
        <div
          css={css`
            padding-left: 16px;
            padding-right: 16px;
            max-width: 100%;
            width: 600px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              font-weight: 500;
              font-size: 20px;
            `}
          >
            <IconButton
              style={{ display: "inline-block" }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}
