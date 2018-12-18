import React from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"

const Container = styled.div``

export default class Home extends React.Component {
  render() {
    return (
      <Container>
        <h1>Home!</h1>

        <Link to="/sandbox">Sandbox</Link>
      </Container>
    )
  }
}
