import React, { Fragment, useEffect } from "react"
import { RouteComponentProps } from "react-router-dom"

import MainView from "./components/MainView"
import TaskAdder from "./components/TaskAdder"

import { selectTaskList } from "services/state/modules/misc"

type Props = RouteComponentProps<{ list_id: string; list_name: string }> & {}

const ListsPage: React.FunctionComponent<Props> = ({ match }) => {
  useEffect(
    () => {
      selectTaskList(match.params.list_id)
      return () => selectTaskList(null)
    },
    [match.params.list_id],
  )

  return (
    <Fragment>
      <TaskAdder />
      <MainView />
    </Fragment>
  )
}

export default ListsPage
