import React, { Fragment } from "react"

import { IconButton } from "@material-ui/core"
import { SwapHoriz, Add, Check, Delete } from "@material-ui/icons"

import IconButtonMenu from "lib/components/IconButtonMenu"
// import TaskAdder from "./TaskAdder"
import HeaderBase from "../HeaderBase"

import { useSelector } from "services/store"

export default () => {
  const {
    taskLists,
    allSelectedTasksComplete,
    allSelectedTasksIncomplete,
  } = useSelector(state => ({
    taskLists: state.taskLists || [],
    allSelectedTasksComplete: false,
    allSelectedTasksIncomplete: false,
  }))

  return (
    <Fragment>
      <HeaderBase
        title={"Selected task list name"}
        editingActions={
          <Fragment>
            {allSelectedTasksComplete || allSelectedTasksIncomplete ? (
              <IconButton
                onClick={allSelectedTasksIncomplete ? () => {} : () => {}}
              >
                {allSelectedTasksIncomplete ? <Check /> : <Add />}
              </IconButton>
            ) : null}

            <IconButtonMenu
              icon={<SwapHoriz />}
              items={taskLists.map(list => ({
                label: list.name,
                action: () => {},
              }))}
            />

            <IconButton onClick={() => {}}>
              <Delete />
            </IconButton>
          </Fragment>
        }
      />
      {/* <TaskAdder /> */}
    </Fragment>
  )
}
