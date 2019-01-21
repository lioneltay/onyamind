import React, {
  useEffect,
  useContext,
  createContext,
  useRef,
  useState,
  forwardRef,
} from "react"
import { Observable, merge } from "rxjs"
import { map, shareReplay } from "rxjs/operators"
import shallowEquals from "shallowequal"

const useForceUpdate = () => {
  const [, forceUpdate] = useState(null)
  return forceUpdate as () => void
}

type Reducer<S> = (state: S) => S
type Selector<S, R> = (state: S) => R

export function create<S, R, A>(reducer$: Observable<Reducer<S>>, initial_state: S) {
  const Context = createContext((null as unknown) as S)
  const reducer_stream = reducer$.pipe(shareReplay(1))

  const connect = (selector: Selector<S, R>, actionSubjects: A) => {
    const actions = Object.keys(actionSubjects).reduce(
      (akk, key) => ({
        ...akk,
        [key]: value => actionSubjects[key].next(value),
      }),
      {},
    )

    return WrappedComponent => props => {
      const context = useContext(Context)

      const state_ref = useRef(null as any)
      const new_state = selector(context)

      const child_ref = useRef(null as any)

      if (shallowEquals(new_state, state_ref.current)) {
        console.log("shallow equals", new_state, state_ref.current)
        return child_ref.current
      }

      state_ref.current = new_state

      child_ref.current = (
        <WrappedComponent {...new_state} {...props} {...actions} />
      )

      return child_ref.current
    }
  }

  const Provider = ({ children, reducerStream }) => {
    const forceUpdate = useForceUpdate()
    const state_ref = useRef(initial_state)
    const state = state_ref.current

    useEffect(
      () => {
        const subscription = reducerStream.subscribe(reducer => {
          state_ref.current = reducer(state_ref.current)
          forceUpdate()
        })
        return () => subscription.unsubscribe()
      },
      [reducerStream],
    )

    return <Context.Provider value={state}>{children}</Context.Provider>
  }

  return {
    connect,
    reducer_stream,
    Provider,
  }
}

type ObservableMap = { [key: string]: Observable<any> }

type ObservableValue<T extends ObservableMap> = {
  [K in keyof T]: T[K] extends Observable<infer R>
    ? (R extends any ? ReturnType<R> : never)
    : never
}

type CombineReducerResult<T extends ObservableMap> = Observable<
  (value: ObservableValue<T>) => ObservableValue<T>
>

export function combineReducers<T extends ObservableMap>(
  localReducers: T,
): CombineReducerResult<T> {
  // convert Observable<localstate => localstate> to Observable<combinedstate => combinedstate>
  const globalReducers = Object.keys(localReducers).reduce((acc, key) => {
    const reducer$ = localReducers[key]

    acc[key] = reducer$.pipe(
      map(localReducer => totalState => ({
        ...totalState,
        [key]: localReducer(totalState[key]),
      })),
    )

    return acc
  }, {})

  const reducer$ = merge(...Object.values(globalReducers))

  return reducer$
}
