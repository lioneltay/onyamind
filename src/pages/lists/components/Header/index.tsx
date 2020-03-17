import React, { Fragment } from "react"
import { noopTemplate as css } from "lib/utils"

import { IconButton } from "@material-ui/core"
import {
  SwapHoriz,
  Add,
  Check,
  Delete,
  Notifications,
} from "@material-ui/icons"

import IconButtonMenu from "lib/components/IconButtonMenu"
import TaskAdder from "./TaskAdder"
import HeaderBase from "components/HeaderBase"

import { useSelector, useActions } from "services/store"

import {
  createTaskNotification,
  createTaskNotifications,
} from "services/notifications"

export default () => {
  const {
    taskLists,
    allSelectedTasksComplete,
    allSelectedTasksIncomplete,
    selectedTaskList,
    multiselect,
    numberOfSelectedTasks,
    selectedTasks,
  } = useSelector((state, s) => ({
    taskLists: state.app.taskLists || [],
    allSelectedTasksComplete: s.listPage.allSelectedTasksComplete(state),
    allSelectedTasksIncomplete: s.listPage.allSelectedTasksInComplete(state),
    selectedTaskList: s.app.selectedTaskList(state),
    multiselect: state.listPage.multiselect,
    numberOfSelectedTasks: s.listPage.selectedTasks(state).length,
    selectedTasks: s.listPage.selectedTasks(state),
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
            <IconButton
              onClick={() => selectedTasks.forEach(createTaskNotification)}
              // onClick={() => createTaskNotifications(selectedTasks)}
            >
              <Notifications />
            </IconButton>

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
              items={taskLists
                .filter(list => list.id !== selectedTaskList?.id)
                .map(list => ({
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
