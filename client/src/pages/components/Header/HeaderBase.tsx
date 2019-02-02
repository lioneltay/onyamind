import React, { Fragment } from "react"
import { styled } from "theme"

import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import Menu from "@material-ui/icons/Menu"
import ArrowBack from "@material-ui/icons/ArrowBack"
import Delete from "@material-ui/icons/Delete"
import Check from "@material-ui/icons/Check"
import Add from "@material-ui/icons/Add"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

import { connect } from "services/state"
import { toggleDrawer } from "services/state/modules/misc"

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
  theme: Theme
  title: string
  onStopEditing: () => void
  editing: boolean
  number_of_selected_tasks: number
  editing_actions?: React.ReactNode
  actions?: React.ReactNode
}

const HeaderBase: React.FunctionComponent<Props> = ({
  title,
  onStopEditing,
  number_of_selected_tasks,
  editing,
  theme,
  editing_actions,
  actions,
}) => {
  return (
    <AppBar position="relative">
      <Container
        style={{
          backgroundColor: editing ? theme.highlight_color : undefined,
        }}
      >
        <Main>
          <LeftSection>
            {editing ? (
              <Fragment>
                <IconButton
                  style={{ display: "inline-block" }}
                  onClick={onStopEditing}
                >
                  <ArrowBack />
                </IconButton>
                <div
                  style={{
                    color: theme.highlighted_text_color,
                    paddingLeft: 18,
                  }}
                >
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
                <Typography variant="h6" style={{ paddingLeft: 18 }}>
                  {title}
                </Typography>
              </Fragment>
            )}
          </LeftSection>

          {editing ? <div>{editing_actions}</div> : <div>{actions}</div>}
        </Main>
      </Container>
    </AppBar>
  )
}

export default connect(state => ({
  theme: state.settings.theme,
}))(HeaderBase)
