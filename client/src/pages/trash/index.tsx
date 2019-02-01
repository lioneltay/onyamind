import React from "react"
import styled from "styled-components"

import { useMediaQuery } from "@tekktekk/react-media-query"
import { Transition, animated } from "react-spring"
import { connect } from "services/state"

import List from "@material-ui/core/List"

import Task from "./components/Task"
import { toggleTaskSelection } from "services/state/modules/trash"

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

type Props = {
  theme: Theme
  tasks: null | Task[]
}

const Trash: React.FunctionComponent<Props> = ({ tasks, theme }) => {
  const mobile = useMediaQuery("(max-width: 800px)")

  if (!tasks) {
    return null
  }

  return (
    <OuterContainer style={{ paddingTop: mobile ? 0 : 24 }}>
      <Container>
        <List className="p-0">
          <Transition
            items={tasks}
            keys={task => task.id}
            initial={{ height: "auto", opacity: 1 }}
            from={{ height: 0, opacity: 0 }}
            enter={{ height: "auto", opacity: 1 }}
            leave={{ height: 0, opacity: 0 }}
          >
            {task => style => {
              return (
                <animated.div style={style}>
                  <Task
                    key={task.id}
                    task={task}
                    onSelectTask={id => toggleTaskSelection(id)}
                  />
                </animated.div>
              )
            }}
          </Transition>
        </List>
      </Container>
    </OuterContainer>
  )
}

export default connect(state => ({
  theme: state.settings.theme,
  tasks: state.trash.tasks,
}))(Trash)
