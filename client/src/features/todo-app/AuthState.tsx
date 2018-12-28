import React from "react"
import firebase from "firebase"

type User = {
  uid: string
}

type Props = {
  children: (user?: User) => React.ReactNode
}

type State = {
  user?: User
  ready: boolean
}

export class AuthState extends React.Component<Props> {
  state: State = {
    user: undefined,
    ready: false,
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user.toJSON(), ready: true })
      } else {
        this.setState({ user: undefined, ready: true })
      }
    })
  }

  componentWillUnmount() {}

  render() {
    return this.state.ready && this.props.children(this.state.user)
  }
}
