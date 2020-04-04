import * as Sentry from "@sentry/browser"

export const initializeErrorReporting = () => {
  Sentry.init({
    dsn: "https://58f05448555d4b888672b765144828f4@sentry.io/5188501",
    environment: process.env.APP_MODE,
    release: "v1",
  })
}
