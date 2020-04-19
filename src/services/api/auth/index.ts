import { firebase } from "services/firebase"
import { assert } from "lib/utils"
import { INITIAL_TASK_LIST_NAME } from "config"
import { createTaskList } from "services/api/task-lists"
import { migrateUserData } from "services/api/callable-functions"
import { logEvent } from "services/analytics/events"

export const onAuthStateChanged = (onChange: (user: User | null) => void) => {
  return firebase.auth().onAuthStateChanged(onChange)
}

export const initializeUserData = async (userId: ID) => {
  await createTaskList({
    name: INITIAL_TASK_LIST_NAME,
    primary: true,
    userId: userId,
  })
}

type ProviderType = "google" | "facebook" | "twitter"

type GetProviderOptions = {
  selectAccount?: boolean
}

const getProvider = (provider: ProviderType, options?: GetProviderOptions) => {
  switch (provider) {
    case "google": {
      const provider = new firebase.auth.GoogleAuthProvider()
      if (options?.selectAccount) {
        provider.setCustomParameters({
          prompt: "select_account",
        })
      }
      return provider
    }
    case "facebook": {
      const provider = new firebase.auth.FacebookAuthProvider()
      if (options?.selectAccount) {
        provider.setCustomParameters({
          prompt: "select_account",
        })
      }
      return provider
    }
    case "twitter": {
      const provider = new firebase.auth.TwitterAuthProvider()
      if (options?.selectAccount) {
        provider.setCustomParameters({
          prompt: "select_account",
        })
      }
      return provider
    }
    default: {
      throw Error("Invalid ProviderType")
    }
  }
}

export const signInWithProvider = async (
  providerName: ProviderType,
  options?: GetProviderOptions,
) => {
  logEvent(`SignInWithProvider|${providerName}|Begin`)
  const existingUser = firebase.auth().currentUser

  assert(existingUser, "No user signed in")

  const provider = getProvider(providerName, options)

  if (!existingUser.isAnonymous) {
    const { user } = await firebase.auth().signInWithPopup(provider)
    return user
  }

  try {
    const { user } = await existingUser.linkWithPopup(provider)
    assert(user?.uid, `Link sign in fail [${providerName}]`)
    logEvent(`SignInWithProvider|Link|${providerName}|Complete`)
    return user
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      throw error
    }

    const { credential } = error
    const { user } = await firebase.auth().signInWithCredential(credential)
    assert(user?.uid, `Merge sign in fail [${providerName}]`)

    await migrateUserData({ fromUserId: existingUser.uid, toUserId: user.uid })

    logEvent(`SignInWithProvider|Merge|${providerName}|Complete`)
    return user
  }
}

async function signInAnonymously() {
  logEvent(`SignInAnonymously|Begin`)
  const res = await firebase.auth().signInAnonymously()
  logEvent(`SignInAnonymously|Complete`)
  return res
}

export async function signInAnonymouslyAndInitializeData() {
  const { user: anonUser } = await signInAnonymously()
  assert(anonUser, "signinAnonmously Failed")
  await initializeUserData(anonUser.uid)
}

export async function signOut() {
  logEvent(`SignOut|Begin`)
  await signInAnonymouslyAndInitializeData()
  logEvent(`SignOut|Complete`)
}

export async function linkProvider(providerName: ProviderType) {
  const provider = getProvider(providerName)

  const user = firebase.auth().currentUser
  assert(user, "Unable to link provider without a user signed in")

  const userCredential = await user.linkWithPopup(provider)

  return userCredential
}

export async function unlinkProvider(providerId: string) {
  const user = firebase.auth().currentUser
  assert(user, "Unable to link provider without a user signed in")

  return user.unlink(providerId)
}

export async function updateEmail(email: string) {
  const user = firebase.auth().currentUser
  assert(user, "Must be signed in to update email")
  await user.updateEmail(email)
  return firebase.auth().currentUser
}
