import React from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"

export default class Header extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">Home</Link>
      </div>
    )
  }
}
