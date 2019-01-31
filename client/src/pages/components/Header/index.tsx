import React from "react"
import styled from "styled-components"

import { Route, Switch } from "react-router-dom"

import ListPageHeader from "./ListPageHeader"
import TrashPageHeader from "./TrashPageHeader"

const StickySection = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
`

const Header: React.FunctionComponent = () => {
  return (
    <StickySection>
      <Switch>
        <Route path="/lists" component={ListPageHeader} />
        <Route path="/trash" component={TrashPageHeader} />
      </Switch>
    </StickySection>
  )
}

export default Header
