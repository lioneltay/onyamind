import React from "react"
import { useTransition, animated } from "react-spring"
import { noopTemplate as css } from "lib/utils"

const MAX_HEIGHT = 120

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
    initial: { maxHeight: MAX_HEIGHT, opacity: 1 },
    from: { maxHeight: 0, opacity: 0 },
    enter: [{ opacity: 1 }, { maxHeight: MAX_HEIGHT, opacity: 1 }],
    leave: [{ opacity: 0 }, { maxHeight: 0, opacity: 0 }],
  })

  return (
    <div
      css={css`
        overflow: hidden;
      `}
    >
      {transitions.map(({ item, key, props }, index) => (
        <animated.div key={key} style={props}>
          {children(item, index)}
        </animated.div>
      ))}
    </div>
  )
}

export default TransitionTaskList
