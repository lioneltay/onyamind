import React from "react"
import { noopTemplate as css } from "lib/utils"

import { Text } from "lib/components"
import { Divider, Switch } from "@material-ui/core"

import { useSelector, useActions } from "services/store"

import { SectionTitle, SubSectionTitle } from "./components"

import Connections from "./Connections"
import EmailSettings from "./EmailSettings"

export default () => {
  const {
    settings: { toggleDarkMode },
  } = useActions()

  const { user, darkMode } = useSelector((state) => ({
    user: state.auth.user,
    darkMode: state.settings.darkMode,
  }))

  if (!user) {
    return null
  }

  return (
    <section
      className="pt-5 px-4"
      css={css`
        max-width: 600px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 100px;
      `}
    >
      <EmailSettings />

      <Connections className="mt-7" />

      <SectionTitle className="mt-7" gutterBottom>
        Preferences
      </SectionTitle>

      <div className="fj-sb fa-c">
        <Text variant="body2">Dark mode</Text>

        <Switch
          checked={darkMode}
          value="checkedB"
          color="primary"
          onChange={toggleDarkMode}
        />
      </div>

      <Divider className="mt-4" />
    </section>
  )
}
