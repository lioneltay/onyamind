import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { noopTemplate as css } from "lib/utils"
import { useSelector, useActions } from "services/store"
import { listPageUrl } from "pages/lists/routing"

import { onTasksChange } from "pages/lists/api"

import { Helmet } from "react-helmet"

import MainView from "./MainView"

type Props = RouteComponentProps<{ listId: string }> & {}

export default ({
  match: {
    params: { listId },
  },
  history,
}: Props) => {
  const {
    app: { selectTaskList, selectPrimaryTaskList, setTaskLists },
    listPage: { setTasks },
  } = useActions()

  const {
    selectedTaskListId,
    taskListsLoaded,
    listIdParamValid,
    userId,
    selectedTaskList,
    completeTasksCount,
    incompleteTasksCount,
  } = useSelector((state, s) => ({
    userId: state.auth.user?.uid,
    selectedTaskListId: state.app.selectedTaskListId,
    selectedTaskList: s.app.selectedTaskList(state),
    taskListsLoaded: !!state.app.taskLists && state.app.taskLists.length > 0,
    listIdParamValid: !!state.app.taskLists?.find((list) => list.id === listId),
    completeTasksCount: s.listPage.completedTasks(state).length,
    incompleteTasksCount: s.listPage.incompletedTasks(state).length,
  }))

  React.useEffect(() => {
    if (userId && listId) {
      return onTasksChange({
        userId,
        listId,
        onChange: (tasks) => {
          setTasks({ tasks, listId })
        },
      })
    }
  }, [userId, listId])

  /**
   * Run once when taskLists are first loaded
   * If the listId param is valid make it the selectedTaskListId
   */
  React.useEffect(() => {
    if (taskListsLoaded) {
      if (listIdParamValid) {
        selectTaskList(listId)
      } else {
        selectPrimaryTaskList()
      }
    }

    return () => {
      selectTaskList(null)
    }
  }, [taskListsLoaded, listIdParamValid, listId])

  // Keep url synced with selectedTaskListId
  React.useEffect(() => {
    if (selectedTaskListId) {
      history.replace(listPageUrl(selectedTaskListId))
    }
  }, [selectedTaskListId])

  return (
    <React.Fragment>
      <Helmet>
        {selectedTaskList?.name ? (
          incompleteTasksCount + completeTasksCount === 0 ? (
            <title>{selectedTaskList.name}</title>
          ) : (
            <title>{`${selectedTaskList?.name} (${completeTasksCount}/${
              completeTasksCount + incompleteTasksCount
            })`}</title>
          )
        ) : null}
      </Helmet>

      <section
        css={css`
          display: flex;
          justify-content: center;
          padding-bottom: 50px;
        `}
      >
        <div
          css={css`
            width: 100%;
            max-width: 600px;
          `}
        >
          <MainView />
        </div>
      </section>
    </React.Fragment>
  )
}
