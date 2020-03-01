import React, { Fragment, useEffect } from "react"
import styled from "styled-components"
import { RouteComponentProps } from "react-router-dom"

import MainView from "./components/MainView"

type Props = RouteComponentProps<{ list_id: string; list_name: string }> & {}

const ListsPage: React.FunctionComponent<Props> = ({ match }) => {
  return (
    <Fragment>
      <MainView />
    </Fragment>
  )
}

export default ListsPage
