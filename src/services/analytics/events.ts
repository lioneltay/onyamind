import { firebase } from "services/firebase"

const analytics = firebase.analytics()

console.log(process.env.NODE_ENV)

export const logEvent = (...args: Parameters<typeof analytics.logEvent>) => {
  analytics.logEvent(...args)
}
