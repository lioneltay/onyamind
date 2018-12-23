import React from "react"
import styled from "styled-components"
import { RouteComponentProps, Link } from "react-router-dom"

import { getTaskList, TaskList } from "./api"

const Container = styled.div``

type Props = RouteComponentProps<{ task_list_id: string }>

type State = {
  task_list?: TaskList
}

export default class Home extends React.Component<Props, State> {
  state: State = {
    task_list: undefined,
  }

  componentDidMount() {
    const task_list_id = parseInt(this.props.match.params.task_list_id)
    console.dir(this.props)
    getTaskList(task_list_id).then(task_list => this.setState({ task_list }))
  }

  render() {
    return (
      <div>
        <Link to="/tasklist">Back</Link>

        <h1>Task List Detail Page</h1>

        <pre>{JSON.stringify(this.state.task_list, null, 2)}</pre>
      </div>
    )
  }
}
