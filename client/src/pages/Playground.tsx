import React from "react"
import { Observable, Subject, interval, merge } from "rxjs"
import { map } from "rxjs/operators"

import { withPropsStream } from "lib/hocs"

type Props = { count: number; title: string }

const Counter: React.SFC<Props> = ({ count, title }) => (
  <div>
    {title}: {count}
  </div>
)

const StreamCounter = withPropsStream(
  merge(interval(1000), interval(300)).pipe(map(count => ({ count }))),
  { count: -1 },
)(Counter)

export default class Playground extends React.Component {
  render() {
    return (
      <div>
        <h1>Playground</h1>
        <StreamCounter title="yo" />
      </div>
    )
  }
}
