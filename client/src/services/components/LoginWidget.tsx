import React from "react"
import styled from "styled-components"
import { firebase } from "services/firebase"

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  background: white;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  cursor: pointer;
  white-space: nowrap;
`

const GoogleIcon = styled.img`
  height: 18px;
  margin-right: 15px;
`

const google_provider = new firebase.auth.GoogleAuthProvider()

google_provider.setCustomParameters({
  prompt: "select_account",
})

export default class LoginPage extends React.Component {
  render() {
    return (
      <GoogleButton
        onClick={() =>
          firebase
            .auth()
            .signInWithPopup(google_provider)
            .then(result => {
              const user = result.user
            })
        }
      >
        <GoogleIcon src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
        Sign in with Google
      </GoogleButton>
    )
  }
}
