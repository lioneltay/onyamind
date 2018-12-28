import React from "react"
import { firebase } from "services/firebase"
import firebaseui from "firebaseui"
import {} from "react-router-dom"

const ui_config: firebaseui.auth.Config = {
  signInFlow: "popup",

  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      return false
    },
  },

  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // scopes: [
      //   'https://www.googleapis.com/auth/plus.login'
      // ],
      customParameters: {
        // Forces account selection even when one account is available.
        prompt: "select_account",
      },
    },
  ],
}

export default class LoginPage extends React.Component {
  ui = new firebaseui.auth.AuthUI(firebase.auth())

  componentDidMount() {
    this.ui.start("#firebaseui-auth-container", ui_config)
  }

  componentWillUnmount() {
    this.ui.delete()
  }

  render() {
    return <div id="firebaseui-auth-container" />
  }
}
