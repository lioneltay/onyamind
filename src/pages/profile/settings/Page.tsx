import React from "react"
import { noopTemplate as css } from "lib/utils"

import { useSelector, useActions } from "services/store"

import Connections from "./Connections"
import EmailSettings from "./EmailSettings"

import { ListItemText } from "lib/components"
import {
  Switch,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemSecondaryAction,
} from "@material-ui/core"
import { Brightness4Icon } from "lib/icons"

export default () => {
  const {
    settings: { toggleDarkMode },
  } = useActions()

  const { permanentUser, darkMode } = useSelector((state) => ({
    permanentUser: !!(state.auth.user && !state.auth.user.isAnonymous),
    darkMode: state.settings.darkMode,
  }))

  return (
    <section
      css={css`
        width: 100%;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
      `}
    >
      <List>
        {permanentUser ? (
          <React.Fragment>
            <EmailSettings />

            <Connections />
          </React.Fragment>
        ) : null}

        <ListItem onClick={toggleDarkMode}>
          <ListItemIcon>
            <Avatar>
              <Brightness4Icon htmlColor="white" />
            </Avatar>
          </ListItemIcon>

          <ListItemText primary="Dark mode" />

          <ListItemSecondaryAction>
            <Switch
              checked={darkMode}
              value="checkedB"
              color="primary"
              onChange={toggleDarkMode}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </section>
  )
}
