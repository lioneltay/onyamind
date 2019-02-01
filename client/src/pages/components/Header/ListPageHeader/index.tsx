import React, { Fragment } from "react"

import IconButton from "@material-ui/core/IconButton"
import Delete from "@material-ui/icons/Delete"
import Check from "@material-ui/icons/Check"
import Add from "@material-ui/icons/Add"

import { connect } from "services/state"
import {
  uncheckSelectedTasks,
  archiveSelectedTasks,
  checkSelectedTasks,
} from "services/state/modules/editing"
import { stopEditing } from "services/state/modules/editing"

import TaskAdder from "./TaskAdder"
import HeaderBase from "../HeaderBase"

type Props = {
  all_selected_tasks_complete: boolean
  all_selected_tasks_incomplete: boolean
  editing: boolean
  selected_task_list_name: string
  number_of_selected_tasks: number
}

const ListPageHeader: React.FunctionComponent<Props> = ({
  selected_task_list_name,
  all_selected_tasks_complete,
  all_selected_tasks_incomplete,
  number_of_selected_tasks,
  editing,
}) => {
  return (
    <Fragment>
      <HeaderBase
        title={selected_task_list_name}
        number_of_selected_tasks={number_of_selected_tasks}
        editing={editing}
        onStopEditing={stopEditing}
        editing_actions={
          <Fragment>
            {all_selected_tasks_complete || all_selected_tasks_incomplete ? (
              <IconButton
                onClick={
                  all_selected_tasks_incomplete
                    ? checkSelectedTasks
                    : uncheckSelectedTasks
                }
              >
                {all_selected_tasks_incomplete ? <Check /> : <Add />}
              </IconButton>
            ) : null}

            <IconButton onClick={archiveSelectedTasks}>
              <Delete />
            </IconButton>
          </Fragment>
        }
      />
      <TaskAdder />
    </Fragment>
  )
}

export default connect(
  ({
    task_lists,
    selected_task_ids,
    selected_task_list_id,
    tasks,
    editing,
    settings: { theme },
  }) => {
    const selected_task_list = task_lists
      ? task_lists.find(list => list.id === selected_task_list_id)
      : undefined

    const selected_tasks = tasks
      ? (selected_task_ids
          .map(id => tasks.find(task => task.id === id))
          .filter(task => !!task) as Task[])
      : []

    const all_selected_tasks_complete = selected_tasks.every(
      task => task.complete,
    )
    const all_selected_tasks_incomplete = selected_tasks.every(
      task => !task.complete,
    )

    return {
      all_selected_tasks_complete,
      all_selected_tasks_incomplete,
      editing,
      selected_task_list_name: selected_task_list
        ? selected_task_list.name
        : "",
      number_of_selected_tasks: selected_task_ids.length,
    }
  },
)(ListPageHeader)
