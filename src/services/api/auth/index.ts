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
    demo: true,
    userId: userId,
  })
}

type EmailCredentials = {
  email: string
  password: string
}

export async function createUserWithEmailAndPassword({
  email,
  password,
}: EmailCredentials) {
  logEvent("CreateUserWithEmailAndPassword|Begin")
  const anonUser = firebase.auth().currentUser
  assert(
    anonUser?.isAnonymous,
    "signInWithProvider fail: No anonymous user signed in",
  )

  const credential = firebase.auth.EmailAuthProvider.credential(email, password)

  const { user } = await anonUser.linkWithCredential(credential)

  user?.reload()
  logEvent("CreateUserWithEmailAndPassword|Complete")
  return user
}

export async function signInWithEmailAndPassword({
  email,
  password,
}: EmailCredentials) {
  logEvent("SignInWithEmailAndPassword|Begin")
  const anonUser = firebase.auth().currentUser
  assert(anonUser?.isAnonymous, "No anonymous user signed in")

  const { user } = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)

  assert(user, "No user")

  await migrateUserData({ fromUserId: anonUser.uid, toUserId: user.uid })

  logEvent("SignInWithEmailAndPassword|Complete")
  return user
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
  const anonUser = firebase.auth().currentUser
  assert(anonUser?.isAnonymous, "No anonymous user signed in")

  const provider = getProvider(providerName, options)

  try {
    const { user } = await anonUser.linkWithPopup(provider)
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

    await migrateUserData({ fromUserId: anonUser.uid, toUserId: user.uid })

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
