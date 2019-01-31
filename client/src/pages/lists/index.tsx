import React, { Fragment, useEffect } from "react"
import { RouteComponentProps } from "react-router-dom"

import MainView from "./components/MainView"
import UndoSnackbar from "./components/UndoSnackbar"
import TaskAdder from "./components/TaskAdder"

import { selectTaskList } from "services/state/modules/misc"

type Props = RouteComponentProps<{ list_id: string; list_name: string }> & {}

const ListsPage: React.FunctionComponent<Props> = ({ match }) => {
  useEffect(
    () => {
      selectTaskList(match.params.list_id)
    },
    [match.params.list_id],
  )

  return (
    <Fragment>
      <TaskAdder />
      <UndoSnackbar />
      <MainView />
    </Fragment>
  )
}

export default ListsPage
