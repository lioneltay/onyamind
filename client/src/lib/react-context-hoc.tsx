import React from "react"

function getConsumer<C>(
  Context: React.Context<C> | React.Consumer<C>,
): React.Consumer<C> {
  return (Context as any).Consumer || Context
}

export const withContext = <C extends any, K extends string>(
  Context: React.Context<C> | React.Consumer<C>,
  key: K,
) => <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  type NewProps = Omit<P, K>

  const AnyComponent = WrappedComponent as any

  return class WithContext extends React.Component<NewProps> {
    render() {
      const Consumer = getConsumer(Context)
      return (
        <Consumer>
          {context => (
            <AnyComponent
              {...Object.assign({}, this.props, {
                [key || "context"]: context,
              })}
            />
          )}
        </Consumer>
      )
    }
  }
}
