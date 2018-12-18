import React from "react"

type State = {
  count: number
}

type Props = {}

type Snapshot = null | {}

export default class Home extends React.Component<Props, State> {
  state: State = {
    count: 0,
  }

  counter: HTMLDivElement | null = null

  getCount = () => {
    if (this.counter) {
      return this.counter.innerText
    }
  }

  constructor(props: Props) {
    super(props)
    console.log("constructor", this.getCount())
  }

  componentDidMount() {
    console.log("componentDidMount", this.getCount())
  }

  componentWillUnmount() {
    console.log("componentWillUnmount", this.getCount())
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    console.log("getDerivedStateFromProps")
    return null
  }

  shouldComponentUpdate(prevProps: Props, prevState: State) {
    console.log("shouldComponentUpdate", this.getCount())
    return true
  }

  getSnapshotBeforeUpdate(prevProps: Props, prevState: State): Snapshot | null {
    console.log("getSnapshotBeforeUpdate", this.getCount())
    return null
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: Snapshot) {
    console.log("componentDidUpdate", this.getCount())
  }

  render() {
    return (
      <div>
        <h1>Component Lifecycle</h1>

        <div>
          <a
            href="https://reactjs.org/docs/react-component.html"
            target="_blank"
            rel="noreferrer noopener"
          >
            Documentation
          </a>
        </div>

        <div>
          <a
            href="http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Lifecycle Diagram
          </a>
        </div>

        <h1>Count (See console for logs)</h1>
        <div ref={el => (this.counter = el)}>{this.state.count}</div>

        <button
          onClick={() => this.setState(state => ({ count: state.count + 1 }))}
        >
          Real Update (shouldComponentUpdate -> true)
        </button>

        <button onClick={() => this.forceUpdate()}>
          Fake Update (shouldComponentUpdate -> false)
        </button>
      </div>
    )
  }
}
