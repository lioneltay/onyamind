import React from "react"

export type ExtractContextType<T> = T extends React.Context<infer R> ? R : never

interface Config<S, A> {
  initial_state: StateType<S>
  actions: ActionFactory<S, A>
}

type UpdateState<S> = (input: ((state: S) => Partial<S>) | Partial<S>) => void

type ActionFactory<S, A> = (updateState: UpdateState<S>) => A

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
  config: Config<S, A>
) {
  const Context = React.createContext<Context<S, A>>({} as any)

  class Provider extends React.Component<Props<S>, Context<S, A>> {
    constructor(props: Props<S>) {
      super(props)

      const updateState = (input: ((state: S) => Partial<S>) | Partial<S>) => {
        this.setState(
          ({ state }) =>
            ({
              state: {
                ...state,
                ...(typeof input === "function" ? input(state) : input),
              },
            } as Context<S, A>)
        )
      }

      const initial_state = this.props.initial_state || config.initial_state

      /* eslint-disable react/no-unused-state */
      this.state = {
        init_complete: !(typeof initial_state === "function"),
        state: typeof initial_state === "function" ? undefined! : initial_state,
        actions: {
          ...config.actions(updateState),
          updateState,
        } as ContextActions<S, A>,
      }
      /* eslint-enable react/no-unused-state */
    }

    componentDidMount() {
      const initial_state = this.props.initial_state || config.initial_state
      if (typeof initial_state !== "object") {
        initial_state().then(state =>
          this.setState({
            init_complete: true,
            state,
          })
        )
      }
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
