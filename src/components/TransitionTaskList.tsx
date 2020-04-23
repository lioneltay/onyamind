import React from "react"
import { animated, useTransition } from "react-spring"
import { TASK_ITEM_HEIGHT } from "config"
import { noopTemplate as css } from "lib/utils"

type TransitionTaskListProps = {
  tasks: Task[]
  children: (task: Task, index: number) => React.ReactNode
}

const TransitionTaskList = ({ tasks, children }: TransitionTaskListProps) => {
  const transitions = useTransition(tasks, (task) => task.id, {
    config: {
      mass: 1,
      tension: 240,
      friction: 24,
      clamp: true,
      precision: 0.1,
    },
    initial: { height: TASK_ITEM_HEIGHT, opacity: 1 },
    from: { height: 0, opacity: 0 },
    enter: [{ opacity: 1 }, { height: TASK_ITEM_HEIGHT, opacity: 1 }],
    leave: [{ opacity: 0 }, { height: 0, opacity: 0 }],
  })

  return (
    <React.Fragment>
      {transitions.map(({ item, key, props }, index) => (
        <animated.div
          key={key}
          style={props}
          css={css`
            overflow: hidden;
          `}
        >
          {children(item, index)}
        </animated.div>
      ))}
    </React.Fragment>
  )
}

export default TransitionTaskList
