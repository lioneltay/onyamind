import * as functions from "firebase-functions"

// https://firebase.google.com/docs/functions/config-env
type Config = {
  private_keys: {
    github_access_token: string
  }
}

const config = functions.config() as Config

export const githubAccessToken = config.private_keys.github_access_token
