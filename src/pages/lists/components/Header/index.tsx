import React, { Fragment } from "react"
import { noopTemplate as css } from "lib/utils"

import { IconButton } from "@material-ui/core"
import { SwapHoriz, Add, Check, Delete } from "@material-ui/icons"

import IconButtonMenu from "lib/components/IconButtonMenu"
import TaskAdder from "./TaskAdder"
import HeaderBase from "components/HeaderBase"

import { useSelector, useActions } from "services/store"

export default () => {
  const {
    taskLists,
    allSelectedTasksComplete,
    allSelectedTasksIncomplete,
    selectedTaskList,
    multiselect,
    numberOfSelectedTasks,
  } = useSelector((state, s) => ({
    taskLists: state.app.taskLists || [],
    allSelectedTasksComplete: s.listPage.allSelectedTasksComplete(state),
    allSelectedTasksIncomplete: s.listPage.allSelectedTasksInComplete(state),
    selectedTaskList: s.app.selectedTaskList(state),
    multiselect: state.listPage.multiselect,
    numberOfSelectedTasks: state.listPage.tasks?.length ?? 0,
  }))

  const {
    completeSelectedTasks,
    decompleteSelectedTasks,
    archiveSelectedTasks,
    moveSelectedTasks,
    setMultiselect,
  } = useActions("listPage")

  return (
    <header
      css={css`
        position: sticky;
        top: 0;
        z-index: 1000;
      `}
    >
      <HeaderBase
        title={selectedTaskList?.name ?? ""}
        numberOfSelectedTasks={numberOfSelectedTasks}
        multiselect={multiselect}
        onEndMultiselect={() => setMultiselect(false)}
        multiselectActions={
          <Fragment>
            {allSelectedTasksComplete || allSelectedTasksIncomplete ? (
              <IconButton
                onClick={
                  allSelectedTasksIncomplete
                    ? completeSelectedTasks
                    : decompleteSelectedTasks
                }
              >
                {allSelectedTasksIncomplete ? <Check /> : <Add />}
              </IconButton>
            ) : null}

            <IconButtonMenu
              icon={<SwapHoriz />}
              items={taskLists.map(list => ({
                label: list.name,
                action: () => moveSelectedTasks({ listId: list.id }),
              }))}
            />

            <IconButton onClick={archiveSelectedTasks}>
              <Delete />
            </IconButton>
          </Fragment>
        }
      />
      <TaskAdder />
    </header>
  )
}
