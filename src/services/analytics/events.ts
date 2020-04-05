import { firebase } from "services/firebase"

const analytics = firebase.analytics()

export const logEvent = (...args: Parameters<typeof analytics.logEvent>) => {
  analytics.logEvent(...args)
}
