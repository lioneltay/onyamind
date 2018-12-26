import React from "react"

export type ExtractContextType<T> = T extends React.Context<infer R> ? R : never

type ConfigValue<A> = {
  actions: A
  componentDidMount?: () => void
  componentWillUnmount?: () => void
}

type Config<S, A> =
  | ConfigValue<A>
  | ((updateState: UpdateState<S>) => ConfigValue<A>)

type UpdateState<S> = (input: ((state: S) => Partial<S>) | Partial<S>) => void

type ContextActions<S, A> = A & { updateState: UpdateState<S> }

type StateType<S> = S | (() => Promise<S>)

type Props<S> = {
  initial_state?: StateType<S>
}

type Context<S, A> = {
  state: S
  actions: ContextActions<S, A>
  init_complete: boolean
}

export function createStateContainer<S extends object, A extends object>(
  init_state: StateType<S>,
  config: Config<S, A>,
) {
  const Context = React.createContext<Context<S, A>>({} as any)

  class Provider extends React.Component<Props<S>, Context<S, A>> {
    updateState = (input: ((state: S) => Partial<S>) | Partial<S>) => {
      this.setState(
        ({ state }) =>
          ({
            state: {
              ...state,
              ...(typeof input === "function" ? input(state) : input),
            },
          } as Context<S, A>),
      )
    }

    config: ConfigValue<A> =
      typeof config === "function" ? config(this.updateState) : config

    constructor(props: Props<S>) {
      super(props)

      const initial_state = this.props.initial_state || init_state

      /* eslint-disable react/no-unused-state */
      this.state = {
        init_complete: !(typeof initial_state === "function"),
        state: typeof initial_state === "function" ? undefined! : initial_state,
        actions: {
          ...this.config.actions,
          updateState: this.updateState,
        } as ContextActions<S, A>,
      }
      /* eslint-enable react/no-unused-state */
    }

    componentDidMount() {
      const initial_state = this.props.initial_state || init_state
      if (typeof initial_state !== "object") {
        initial_state().then(state =>
          this.setState({
            init_complete: true,
            state,
          }),
        )
      }

      this.config.componentDidMount && this.config.componentDidMount()
    }

    componentWillUnmount() {
      this.config.componentWillUnmount && this.config.componentWillUnmount()
    }

    render() {
      return (
        this.state.init_complete && (
          <Context.Provider value={this.state}>
            {this.props.children}
          </Context.Provider>
        )
      )
    }
  }

  return {
    Provider,
    Consumer: Context.Consumer,
    Context,
  }
}
