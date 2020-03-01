import React, { Fragment } from "react"
import { useTheme } from "theme"
import { noopTemplate as css } from "lib/utils"

import { ArrowBack, Delete, Check, Add, Menu } from "@material-ui/icons"
import { Toolbar, AppBar, IconButton, Typography } from "@material-ui/core"

import { useSelector } from "services/store"

type Props = {
  title: string
  editingActions?: React.ReactNode
  actions?: React.ReactNode
}

export default ({ title, editingActions, actions }: Props) => {
  const { numberOfSelectedTasks, editing } = useSelector(state => ({
    editing: false,
    numberOfSelectedTasks: 5,
  }))
  const theme = useTheme()

  return (
    <AppBar position="relative">
      <Toolbar
        css={css`
          padding-left: 0;
          padding-right: 0;
          display: flex;
          justify-content: center;
          background: ${editing ? theme.highlight_color : undefined};
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
            {editing ? (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  onClick={() => {}}
                >
                  <ArrowBack />
                </IconButton>
                <div
                  style={{
                    color: theme.highlighted_text_color,
                    paddingLeft: 18,
                  }}
                >
                  {numberOfSelectedTasks} selected
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  // onClick={toggleDrawer}
                >
                  <Menu />
                </IconButton>
                <Typography variant="h6" style={{ paddingLeft: 18 }}>
                  {title}
                </Typography>
              </Fragment>
            )}
          </div>

          {editing ? <div>{editingActions}</div> : <div>{actions}</div>}
        </div>
      </Toolbar>
    </AppBar>
  )
}
