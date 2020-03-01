import React, { Fragment, useEffect } from "react"
import styled from "styled-components"
import { RouteComponentProps } from "react-router-dom"

import MainView from "./components/MainView"

import { selectTaskList } from "services/state/modules/list-view"

type Props = RouteComponentProps<{ list_id: string; list_name: string }> & {}

const ListsPage: React.FunctionComponent<Props> = ({ match }) => {
  useEffect(() => {
    selectTaskList(match.params.list_id)
    return () => {
      selectTaskList(null)
    }
  }, [match.params.list_id])

  return (
    <Fragment>
      <MainView />
    </Fragment>
  )
}

export default ListsPage
