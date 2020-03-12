import React, { Fragment } from "react"
import { RouteComponentProps } from "react-router-dom"

import MainView from "./components/MainView"

import { useActions } from "services/store"

type Props = RouteComponentProps<{ listId: string; listName: string }> & {}

const ListsPage: React.FunctionComponent<Props> = ({ match }) => {
  const { selectTaskList } = useActions()

  React.useEffect(() => {
    selectTaskList(match.params.listId)
    return () => {
      selectTaskList(null)
    }
  }, [match.params.listId])

  return (
    <Fragment>
      <MainView />
    </Fragment>
  )
}

export default ListsPage
