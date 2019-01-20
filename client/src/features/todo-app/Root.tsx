import React from "react"
import styled from "styled-components"

import Header from "./components/Header"
import Drawer from "./components/Drawer"
import TaskAdder from "./components/TaskAdder"
import MainView from "./components/MainView"

import { background_color } from "./constants"

const PageContainer = styled.div`
  background: ${background_color};
  min-height: 100vh;
`

const TaskPage: React.FunctionComponent = () => {
  return (
    <PageContainer>
      <Header />
      <TaskAdder />
      <Drawer />
      <MainView />
    </PageContainer>
  )
}

export default TaskPage
