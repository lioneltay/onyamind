import React, { useState, useEffect } from "react"
import { Observable } from "rxjs"

export const withPropsStream = <T extends object>(
  observable: Observable<T>,
  initial_props?: T,
) => <P extends T>(WrappedComponent: React.ComponentType<P>) => {
  type Props = Omit<P, keyof T>

  const ComponentFromObservable: React.FunctionComponent<Props> = props => {
    const [observable_props, updateObservableProps] = useState(initial_props)

    useEffect(() => {
      const subscription = observable.subscribe(props => {
        updateObservableProps(props)
      })
      return () => subscription.unsubscribe()
    }, [])

    return observable_props ? (
      <WrappedComponent {...{ ...props, ...observable_props } as P} />
    ) : null
  }

  return ComponentFromObservable
}
