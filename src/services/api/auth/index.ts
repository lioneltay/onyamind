import { firebase } from "services/firebase"
import { assert } from "lib/utils"
import { INITIAL_TASK_LIST_NAME } from "config"
import { createTaskList } from "services/api/task-lists"
import { migrateUserData } from "services/api/callable-functions"

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

export const createUserWithEmailAndPassword = ({
  email,
  password,
}: EmailCredentials) =>
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.error(errorCode, errorMessage)

      throw error
    })

export const signInWithEmailAndPassword = ({
  email,
  password,
}: EmailCredentials) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.error(errorCode, errorMessage)

      throw error
    })

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
  const anonUser = firebase.auth().currentUser
  assert(
    anonUser?.isAnonymous,
    "signInWithProvider fail: No anonymous user signed in",
  )

  const provider = getProvider(providerName, options)

  try {
    const { user } = await anonUser.linkWithPopup(provider)
    assert(user?.uid, `Link sign in fail [${providerName}]`)
    return user
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      throw error
    }

    const { credential } = error
    const { user } = await firebase.auth().signInWithCredential(credential)
    assert(user?.uid, `Merge sign in fail ${providerName}`)

    await migrateUserData({ fromUserId: anonUser.uid, toUserId: user.uid })

    return user
  }
}

function signInAnonymously() {
  return firebase.auth().signInAnonymously()
}

export async function signInAnonymouslyAndInitializeData() {
  const { user: anonUser } = await signInAnonymously()
  assert(anonUser, "signinAnonmously Failed")
  await initializeUserData(anonUser.uid)
}

export async function signOut() {
  await signInAnonymouslyAndInitializeData()
}
