import React, { Fragment } from "react"
import { useTheme } from "theme"
import { noopTemplate as css } from "lib/utils"

import { ArrowBack, Menu } from "@material-ui/icons"
import { Toolbar, AppBar, IconButton } from "@material-ui/core"
import { Text } from "lib/components"

import { useSelector, useActions } from "services/store"

type Props = Stylable & {
  title: string
  editingActions?: React.ReactNode
  actions?: React.ReactNode
}

export default ({ title, editingActions, actions, ...rest }: Props) => {
  const { toggleDrawer, setMultiselect } = useActions()

  const { numberOfSelectedTasks, multiselect } = useSelector((state, s) => ({
    multiselect: state.listPage.multiselect,
    numberOfSelectedTasks: s.listPage.selectedTasks(state).length,
  }))

  const theme = useTheme()

  return (
    <AppBar {...rest} position="relative">
      <Toolbar
        css={css`
          padding-left: 0;
          padding-right: 0;
          display: flex;
          justify-content: center;
          background: ${multiselect ? theme.highlightColor : undefined};
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
            {multiselect ? (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  onClick={() => setMultiselect(false)}
                >
                  <ArrowBack />
                </IconButton>
                <div
                  style={{
                    color: theme.highlightedTextColor,
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
                  onClick={toggleDrawer}
                >
                  <Menu />
                </IconButton>
                <Text variant="h6" style={{ paddingLeft: 18 }}>
                  {title}
                </Text>
              </Fragment>
            )}
          </div>

          {multiselect ? <div>{editingActions}</div> : <div>{actions}</div>}
        </div>
      </Toolbar>
    </AppBar>
  )
}
