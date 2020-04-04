import * as functions from "firebase-functions"

type Config = {
  private_keys: {
    github_access_token: string
  }
}

const config = functions.config() as Config

export const githubAccessToken = config.private_keys.github_access_token
