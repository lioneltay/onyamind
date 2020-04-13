import React from "react"
import { noopTemplate as css } from "lib/utils"

import { Text, Button } from "lib/components"
import { Divider } from "@material-ui/core"

import { GoogleButton, FacebookButton } from "lib/login-buttons"

import { useSelector, useActions } from "services/store"

import { linkProvider, unlinkProvider } from "services/api"

export default () => {
  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }))

  if (!user) {
    return null
  }

  console.log(user.providerData)

  const googleData = user.providerData.find(
    (data) => data?.providerId === "google.com",
  )
  const facebookData = user.providerData.find(
    (data) => data?.providerId === "facebook.com",
  )

  return (
    <section
      css={css`
        max-width: 600px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      `}
    >
      <Text variant="h5">Connections</Text>

      <Divider className="my-4" />

      <SocialConnectionInfo provider="google" data={googleData} />

      <Divider className="my-4" />

      <SocialConnectionInfo provider="facebook" data={facebookData} />

      <Divider className="my-4" />
    </section>
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
        <Text variant="h6" gutterBottom>
          {data ? `You are connected to ${name}` : `Connect to ${name}`}
        </Text>

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

            <Text
              variant="caption"
              color="textSecondary"
              role="button"
              onClick={() => {
                unlinkProvider(data.providerId)
                  .then((user) => {
                    setUser(user)
                    openSnackbar({
                      type: "success",
                      text: `Disconnected from ${name}`,
                    })
                  })
                  .catch((error) => {
                    console.log("ERROR", error)
                    openSnackbar({
                      type: "error",
                      text: "FAILURE",
                    })
                    throw error
                  })
              }}
            >
              (disconnect)
            </Text>
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
                console.log("ERROR", error)
                openSnackbar({
                  type: "error",
                  text: "FAILURE",
                })
                throw error
              })
          }}
        >
          Connect to {name}
        </ProviderButton>
      )}
    </div>
  )
}
