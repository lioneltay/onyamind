import React from "react"
import { noopTemplate as css } from "lib/utils"

import { Text, TextProps } from "lib/components"
import { Divider } from "@material-ui/core"

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
    <div {...props}>
      <SectionTitle className="mt-7">Connections</SectionTitle>

      {user.providerData.length === 0 ? (
        <Text color="error" variant="body2">
          You have no connected login methods and will have to sign in by email
          in the future
        </Text>
      ) : null}

      <Divider className="my-4" />

      <SocialConnectionInfo provider="google" data={googleData} />

      <Divider className="my-4" />

      <SocialConnectionInfo provider="facebook" data={facebookData} />

      <Divider className="mt-4" />
    </div>
  )
}

const PROVIDER_INFO = {
  google: {
    name: "Google",
    ProviderButton: GoogleButton,
  },
  facebook: {
    name: "Facebook",
    ProviderButton: FacebookButton,
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

  const { name, ProviderButton } = PROVIDER_INFO[provider]

  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      `}
      {...rest}
    >
      <div>
        <SubSectionTitle gutterBottom>
          {data ? `You are connected to ${name}` : `Connect to ${name}`}
        </SubSectionTitle>

        <Text variant="body2">
          {data
            ? `You can now log in with ${name}`
            : `Connect to log in with ${name}`}
        </Text>
      </div>

      {data ? (
        <div className="fa-s">
          <div className="fd-c fa-e">
            {data.displayName ? (
              <Text variant="body2">{data.displayName}</Text>
            ) : null}

            {data.email ? <Text variant="body2">{data.email}</Text> : null}

            {disconnecting ? null : (
              <Text
                variant="caption"
                color="textSecondary"
                role="button"
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
                (disconnect)
              </Text>
            )}
          </div>

          {data.photoURL ? (
            <img
              src={data.photoURL}
              className="ml-4"
              css={css`
                width: 48px;
                height: 48px;
                border-radius: 4px;
              `}
            />
          ) : null}
        </div>
      ) : (
        <ProviderButton
          onClick={async () => {
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
          Connect to {name}
        </ProviderButton>
      )}
    </div>
  )
}
