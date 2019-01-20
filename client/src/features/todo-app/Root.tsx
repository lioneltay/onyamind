import React from "react"
import styled from "styled-components"

import Header from "./Header"
import Drawer from "./Drawer"
import TaskAdder from "./TaskAdder"
import MainView from "./MainView"

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
