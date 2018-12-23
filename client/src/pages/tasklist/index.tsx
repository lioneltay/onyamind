import React from "react"
import { Link, Switch, Route } from "react-router-dom"

import { withContext } from "lib/react-context-hoc"
import { StateContainer, TaskList, ContextType } from "./state-container"

import TaskListDetailsPage from "./task-list-details"

export default class Routing extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          path="/tasklist/:task_list_id"
          render={route_info => (
            <StateContainer.Provider>
              <TaskListDetailsPage {...route_info} />
            </StateContainer.Provider>
          )}
        />
        <Route
          render={route_info => (
            <StateContainer.Provider>
              <TaskListPage {...route_info} />
            </StateContainer.Provider>
          )}
        />
      </Switch>
    )
  }
}

type Props = {
  context: ContextType
}

type State = {
  title: string
}

class TaskListPageImplementation extends React.Component<Props, State> {
  state: State = {
    title: "",
  }

  componentDidMount() {
    this.props.context.actions.getTaskLists()
  }

  render() {
    return (
      <div>
        <h1>TaskList</h1>

        <div>
          <input
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
          />

          <button
            className="ml-3"
            onClick={() => {
              this.props.context.actions
                .addTaskList({
                  title: this.state.title,
                })
                .then(() => this.setState({ title: "" }))
            }}
          >
            <i className="fas fa-plus" />
          </button>
        </div>

        {this.props.context.state.task_lists.map(task => (
          <div key={task.id}>
            <div className="fa-s">
              <Link to={`/tasklist/${task.id}`}>{task.title}</Link>
              <div className="ml-3">
                <i
                  className="fas fa-times"
                  onClick={() => this.props.context.actions.removeTaskList(task.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

const TaskListPage = withContext(StateContainer.Context, "context")(
  TaskListPageImplementation
)
