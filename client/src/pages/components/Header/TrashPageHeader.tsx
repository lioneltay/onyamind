import React, { Fragment } from "react"
import styled from "styled-components"

import { highlight_color, highlighted_text_color } from "theme"

import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/icons/Menu"
import ArrowBack from "@material-ui/icons/ArrowBack"
import Delete from "@material-ui/icons/Delete"
import DeleteSweep from "@material-ui/icons/DeleteSweep"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

import { connect } from "services/state"
import { toggleDrawer } from "services/state/modules/misc"
import {
  emptyTrash,
  clearTaskSelection,
  deleteSelectedTasks,
} from "services/state/modules/trash"

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
  editing: boolean
  number_of_selected_tasks: number
}

const TrashPageHeader: React.FunctionComponent<Props> = ({
  number_of_selected_tasks,
  editing,
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
                  onClick={clearTaskSelection}
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
                <div style={{ paddingLeft: 18, color: "black" }}>Trash</div>
              </Fragment>
            )}
          </LeftSection>

          {editing ? (
            <IconButton onClick={deleteSelectedTasks}>
              <Delete />
            </IconButton>
          ) : (
            <IconButton onClick={emptyTrash}>
              <DeleteSweep />
            </IconButton>
          )}
        </Main>
      </Container>
    </AppBar>
  )
}

export default connect(state => {
  const { selected_task_ids } = state.trash

  return {
    editing: selected_task_ids.length > 0,
    number_of_selected_tasks: selected_task_ids.length,
  }
})(TrashPageHeader)
