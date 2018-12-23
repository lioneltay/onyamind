import React from "react"
import { Link, Switch, Route } from "react-router-dom"

import { addTaskList, getTaskLists, removeTask, TaskList } from "./api"

import TaskListDetailsPage from "./task-list-details"

export default class Routing extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/tasklist/:task_list_id" component={TaskListDetailsPage} />
        <Route component={TaskListPage} />
      </Switch>
    )
  }
}
type State = {
  task_lists: TaskList[]
  title: string
}

class TaskListPage extends React.Component<{}, State> {
  state: State = {
    task_lists: [],
    title: "",
  }

  componentDidMount() {
    getTaskLists().then(task_lists => this.setState({ task_lists }))
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
              addTaskList({ title: this.state.title }).then(new_task => {
                this.setState(state => ({
                  title: "",
                  task_lists: [...state.task_lists, new_task],
                }))
              })
            }}
          >
            <i className="fas fa-plus" />
          </button>
        </div>

        {this.state.task_lists.map(task => (
          <div key={task.id}>
            <div className="fa-s">
              <Link to={`/tasklist/${task.id}`}>{task.title}</Link>
              <div className="ml-3">
                <i
                  className="fas fa-times"
                  onClick={() =>
                    removeTask(task.id).then(() => {
                      this.setState(state => ({
                        task_lists: state.task_lists.filter(
                          t => t.id !== task.id
                        ),
                      }))
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}
