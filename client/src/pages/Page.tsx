import React, { Fragment, useEffect } from "react"
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom"

import { connect } from "services/state"
import { selectTaskList } from "services/state/modules/list-view"
import { setTouchEnabled, toggleDrawer } from "services/state/modules/ui"

import { urlSlug } from "lib/slug"

import {
  getTaskLists,
  createDefaultTaskList,
} from "services/state/modules/task-lists"
import { user_s } from "services/state/modules/user"
import { primaryTaskList } from "services/state/modules/task-lists/selector"

type Props = RouteComponentProps & {
  primary_task_list: TaskList
}

const Root: React.FunctionComponent<Props> = ({
  history,
  primary_task_list,
}) => {
  useEffect(() => {
    const handler = () => setTouchEnabled(true)
    window.addEventListener("touchstart", handler)
    return () => window.removeEventListener("touchstart", handler)
  }, [])

  return primary_task_list ? (
    <Redirect
      to={`/lists/${primary_task_list.id}/${urlSlug(primary_task_list.name)}`}
    />
  ) : null
}

export default withRouter(
  connect(state => ({
    primary_task_list: primaryTaskList(state),
  }))(Root),
)
