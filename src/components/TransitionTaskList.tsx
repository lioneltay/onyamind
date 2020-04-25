import React from "react"
import { useTransition, animated } from "react-spring"
import { noopTemplate as css } from "lib/utils"

const MAX_HEIGHT = 120

type TransitionTaskListProps = {
  tasks: Task[]
  children: (task: Task, index: number) => React.ReactNode
}

const TransitionTaskList = ({ tasks, children }: TransitionTaskListProps) => {
  const [immediate, setImmediate] = React.useState(true)

  React.useEffect(() => {
    setImmediate(false)
  })

  const transitions = useTransition(tasks, (task) => task.id, {
    immediate,
    config: {
      mass: 1,
      tension: 240,
      // tension: 80,
      friction: 24,
      clamp: true,
      precision: 0.1,
    },
    // initial: { maxHeight: MAX_HEIGHT, opacity: 1 },
    from: { maxHeight: 0, opacity: 0 },
    enter: (item: any) => async (next: any) => {
      await next({ opacity: 1 })
      await next({ maxHeight: MAX_HEIGHT })
    },
    leave: (item: any) => async (next: any) => {
      await next({ opacity: 0 })
      await next({ maxHeight: 0 })
    },
  } as any)

  return (
    <div>
      {transitions.map(({ item, key, props }, index) => (
        <animated.div key={key} style={props}>
          {children(item, index)}
        </animated.div>
      ))}
    </div>
  )
}

export default TransitionTaskList
