import React from "react"
import { Observable } from "rxjs"

export const withPropsStream = <T extends object>(
  observable: Observable<T>,
  initial_props?: T,
) => <P extends T>(WrappedComponent: React.ComponentType<P>) => {
  type Props = Omit<P, keyof T>

  type State = {
    props?: T
  }

  return class ComponentFromObservable extends React.Component<Props, State> {
    state: State = {
      props: initial_props,
    }

    constructor(props: P) {
      super(props)

      observable.subscribe(props => this.setState({ props }))
    }

    render() {
      return this.state.props ? (
        <WrappedComponent {...{ ...this.props, ...this.state.props } as P} />
      ) : null
    }
  }
}
