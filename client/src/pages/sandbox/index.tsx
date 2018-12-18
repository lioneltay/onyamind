import React from "react"
import styled from "styled-components"
import { Switch, Link, Route } from "react-router-dom"

import Playground from "./playground"

export default class Sandbox extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/sandbox/playground" component={Playground} />

        <Route
          render={() => (
            <div>
              <h1 className="text-500 cursor-pointer">Sandbox</h1>

              <Link to="/sandbox/playground">Playground</Link>
            </div>
          )}
        />
      </Switch>
    )
  }
}
