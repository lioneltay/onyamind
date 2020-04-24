import React from "react"
import { noopTemplate as css } from "lib/utils"

import { Text, TextProps } from "lib/components"
import { Button, Modal, ListItemText } from "lib/components"
import {
  TextField,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemSecondaryAction,
} from "@material-ui/core"
import { FacebookIcon, GoogleIcon, ClearIcon } from "lib/icons"

import { GoogleButton, FacebookButton } from "lib/login-buttons"

import { useSelector, useActions } from "services/store"

import { linkProvider, unlinkProvider } from "services/api"

import { SectionTitle, SubSectionTitle } from "./components"

import { logError } from "services/analytics/error-reporting"

export default (props: Stylable) => {
  const {
    ui: { openSnackbar },
  } = useActions()

  const { user } = useSelector((state) => ({
    user: state.auth.user,
    darkMode: state.settings.darkMode,
  }))

  if (!user) {
    return null
  }

  const googleData = user.providerData.find(
    (data) => data?.providerId === "google.com",
  )
  const facebookData = user.providerData.find(
    (data) => data?.providerId === "facebook.com",
  )

  React.useEffect(() => {
    if (user.providerData.length === 0) {
      openSnackbar({
        type: "warning",
        text: "You have no connected login methods",
      })
    }
  }, [user.providerData.length])

  return (
    <React.Fragment>
      <SocialConnectionInfo
        className="px-4"
        provider="google"
        data={googleData}
      />

      <SocialConnectionInfo
        className="px-4"
        provider="facebook"
        data={facebookData}
      />
    </React.Fragment>
  )
}

const PROVIDER_INFO = {
  google: {
    name: "Google",
    icon: <GoogleIcon />,
  },
  facebook: {
    name: "Facebook",
    icon: <FacebookIcon />,
  },
} as const

type SocialConnectionInfoProps = Stylable & {
  data: User["providerData"][number] | undefined
  provider: "google" | "facebook"
}

const SocialConnectionInfo = ({
  data,
  provider,
  ...rest
}: SocialConnectionInfoProps) => {
  const [disconnecting, setDisconnecting] = React.useState(false)

  const {
    ui: { openSnackbar },
    auth: { setUser },
  } = useActions()

  const { name, icon } = PROVIDER_INFO[provider]

  return (
    <ListItem
      onClick={async () => {
        if (data) {
          return
        }

        linkProvider(provider)
          .then(({ user }) => {
            setUser(user)
            openSnackbar({
              type: "success",
              text: `Connected to ${name}`,
            })
          })
          .catch((error) => {
            console.error("ERROR", error)
            openSnackbar({
              type: "error",
              text: error.message,
            })
            logError(error)
          })
      }}
    >
      <ListItemIcon>
        <Avatar>{icon}</Avatar>
      </ListItemIcon>

      {data ? (
        <ListItemText primary={`Disconnect ${name}`} secondary={data.email} />
      ) : (
        <ListItemText primary={`Connect to ${name}`} />
      )}

      {data && !disconnecting ? (
        <ListItemSecondaryAction
          onClick={async () => {
            setDisconnecting(true)
            await unlinkProvider(data.providerId)
              .then((user) => {
                setUser(user)
                openSnackbar({
                  type: "success",
                  text: `Disconnected from ${name}`,
                })
              })
              .catch((error) => {
                console.error("ERROR", error)
                openSnackbar({
                  type: "error",
                  text: error.message,
                })
                logError(error)
              })
            setDisconnecting(false)
          }}
        >
          <ClearIcon htmlColor="white" />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  )
}
