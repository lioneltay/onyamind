import React, { Fragment } from "react"
import styled from "styled-components"

import { highlight_color, highlighted_text_color } from "theme"

import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/icons/Menu"
import ArrowBack from "@material-ui/icons/ArrowBack"
import Delete from "@material-ui/icons/Delete"
import Check from "@material-ui/icons/Check"
import Add from "@material-ui/icons/Add"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

import { connect } from "services/state"
import { toggleDrawer } from "services/state/modules/misc"
import {
  uncheckSelectedTasks,
  deleteSelectedTasks,
  checkSelectedTasks,
} from "services/state/modules/editing"
import { ConnectedDispatcher } from "lib/rxstate"
import { stopEditing } from "services/state/modules/editing"

const Container = styled(Toolbar)`
  padding-left: 0;
  padding-right: 0;
  display: flex;
  justify-content: center;
` as typeof Toolbar

const Main = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  max-width: 100%;
  width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
`

type Props = {
  all_selected_tasks_complete: boolean
  all_selected_tasks_incomplete: boolean
  editing: boolean
  selected_task_list_name: string
  number_of_selected_tasks: number
  toggleDrawer: ConnectedDispatcher<typeof toggleDrawer>
  stopEditing: ConnectedDispatcher<typeof stopEditing>
  checkSelectedTasks: ConnectedDispatcher<typeof checkSelectedTasks>
  uncheckSelectedTasks: ConnectedDispatcher<typeof uncheckSelectedTasks>
  deleteSelectedTasks: ConnectedDispatcher<typeof deleteSelectedTasks>
}

const Header: React.FunctionComponent<Props> = ({
  selected_task_list_name,
  all_selected_tasks_complete,
  all_selected_tasks_incomplete,
  number_of_selected_tasks,
  toggleDrawer,
  editing,
  stopEditing,
  checkSelectedTasks,
  uncheckSelectedTasks,
  deleteSelectedTasks,
}) => {
  return (
    <AppBar position="relative">
      <Container
        style={{
          backgroundColor: editing ? highlight_color : "white",
        }}
      >
        <Main>
          <LeftSection>
            {editing ? (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  onClick={stopEditing}
                >
                  <ArrowBack />
                </IconButton>
                <div style={{ color: highlighted_text_color, paddingLeft: 18 }}>
                  {number_of_selected_tasks} selected
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  onClick={toggleDrawer}
                >
                  <Menu />
                </IconButton>
                <div style={{ paddingLeft: 18, color: "black" }}>
                  {selected_task_list_name}
                </div>
              </Fragment>
            )}
          </LeftSection>

          {editing ? (
            <div style={{ display: "flex" }}>
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

              <IconButton onClick={deleteSelectedTasks}>
                <Delete />
              </IconButton>
            </div>
          ) : null}
        </Main>
      </Container>
    </AppBar>
  )
}

export default connect(
  ({
    task_lists,
    selected_task_ids,
    selected_task_list_id,
    tasks,
    editing,
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
  {
    toggleDrawer,
    stopEditing,
    checkSelectedTasks,
    uncheckSelectedTasks,
    deleteSelectedTasks,
  },
)(Header)
