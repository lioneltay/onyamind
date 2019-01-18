import React, { Fragment } from "react"
import styled from "styled-components"

import { HEIGHT as HEADER_HEIGHT } from "./Header"
// import { IconButton } from "./widgets"
import  Add  from "@material-ui/icons/Add"
import IconButton from "@material-ui/core/IconButton"
import { background_color, highlighted_text_color } from "./constants"
import { useAppState } from "./state"
import { addTask } from "./api"

export const HEIGHT = 81

const OuterContainer = styled.div`
  position: fixed;
  z-index: 1100;
  background: ${background_color};
  top: ${HEADER_HEIGHT}px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 24px;
  height: ${HEIGHT}px;
`

const Placeholder = styled.div`
  height: ${HEIGHT}px;
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 600px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 0 8px;

  border-bottom: 1px solid #ddd;
`

const Input = styled.input`
  font-weight: 500;
  font-size: 16px;
  border: none;
  outline: none;
  padding: 10px 18px;
`

const SelectAllButton = styled.div`
  color: ${highlighted_text_color};
  font-weight: 500;
  cursor: pointer;
`

type Props = Stylable & {}

const TaskAdder: React.FunctionComponent<Props> = ({ className, style }) => {
  const {
    editing,
    new_task_title,
    user,
    actions: { selectAllIncompleteTasks, setNewTaskTitle },
  } = useAppState()

  const handleIt = () => {
    if (new_task_title.length === 0) {
      return
    }

    setNewTaskTitle("")
    addTask({ title: new_task_title, notes: "", uid: user ? user.uid : null })
  }

  return (
    <Fragment>
      <Placeholder />

      <OuterContainer className={className} style={style}>
        <Container style={{ background: editing ? background_color : "white" }}>
          {editing ? (
            <SelectAllButton onClick={selectAllIncompleteTasks}>
              Select All
            </SelectAllButton>
          ) : (
            <Fragment>
              <IconButton onClick={handleIt}>
                <Add />
              </IconButton>

              <Input
                className="fg-1"
                placeholder="Add item"
                value={new_task_title}
                onChange={e => setNewTaskTitle(e.currentTarget.value)}
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    handleIt()
                  }
                }}
              />
            </Fragment>
          )}
        </Container>
      </OuterContainer>
    </Fragment>
  )
}

export default TaskAdder
