import React, {
  useEffect,
  useContext,
  createContext,
  useRef,
  forwardRef,
} from "react"
import { Observable, merge, Subject } from "rxjs"
import { map, shareReplay } from "rxjs/operators"
import shallowEquals from "shallowequal"

import { useForceUpdate } from "./utils"

export type Reducer<S> = (state: S) => S
type Selector<S, R> = (state: S) => R

export function create<S>(reducer$: Observable<Reducer<S>>, initial_state: S) {
  const Context = createContext((null as unknown) as S)
  const reducer_stream = reducer$.pipe(shareReplay(1))

  type SubjectMap<T = any> = { [key: string]: Subject<T> }
  type ActionCreatorsResult<T extends SubjectMap> = {
    [K in keyof T]: T[K] extends Subject<infer R> ? (payload: R) => void : never
  }

  const connect = <A extends SubjectMap, R extends any>(
    selector: Selector<S, R>,
    actionSubjects: A,
  ) => {
    const actions = Object.keys(actionSubjects).reduce(
      (akk, key) => {
        return {
          ...akk,
          [key]: (value: any) => actionSubjects[key].next(value),
        }
      },
      {} as ActionCreatorsResult<A>,
    )

    return <P extends any>(WrappedComponent: React.ComponentType<P>) => {
      type NewProps = Omit<P, keyof R | keyof ActionCreatorsResult<A>>

      const Connect = forwardRef<typeof WrappedComponent, NewProps>(
        (props, ref) => {
          const context = useContext(Context)

          const state_ref = useRef((null as unknown) as R)
          const new_state = selector(context)

          const child_ref = useRef((null as unknown) as React.ReactElement<
            NewProps
          >)

          if (shallowEquals(new_state, state_ref.current)) {
            console.log("shallow equals", new_state, state_ref.current)
            return child_ref.current
          }

          state_ref.current = new_state

          const Comp = WrappedComponent as React.ComponentType<any>
          child_ref.current = (
            <Comp {...new_state} {...props} {...actions} />
          ) as React.ReactElement<NewProps>

          return child_ref.current
        },
      )

      return Connect
    }
  }

  const Provider: React.FunctionComponent = ({ children }) => {
    const forceUpdate = useForceUpdate()
    const state_ref = useRef(initial_state)
    const state = state_ref.current

    useEffect(
      () => {
        const subscription = reducer_stream.subscribe(reducer => {
          state_ref.current = reducer(state_ref.current)
          forceUpdate()
        })
        return () => subscription.unsubscribe()
      },
      [reducer_stream],
    )

    return <Context.Provider value={state}>{children}</Context.Provider>
  }

  return {
    connect,
    reducer_stream,
    Provider,
  }
}

export type ObservableMap<T = any> = { [key: string]: Observable<T> }

export type ObservableValue<T extends ObservableMap> = {
  [K in keyof T]: T[K] extends Observable<infer R>
    ? (R extends FunctionType ? ReturnType<R> : never)
    : never
}

export type ObservableReducer<T extends ObservableMap> = (
  value: ObservableValue<T>,
) => ObservableValue<T>

export type CombineReducerResult<T extends ObservableMap> = Observable<
  ObservableReducer<T>
>

export function combineReducers<T extends ObservableMap>(
  localReducers: T,
): CombineReducerResult<T> {
  const globalReducers: ObservableMap<ObservableReducer<T>> = Object.keys(
    localReducers,
  ).reduce(
    (acc, key) => {
      const reducer$ = localReducers[key]

      acc[key] = reducer$.pipe(
        map(localReducer => (totalState: ObservableValue<T>) => ({
          ...totalState,
          [key]: localReducer(totalState[key]),
        })),
      )

      return acc
    },
    {} as ObservableMap<ObservableReducer<T>>,
  )

  const reducer$ = merge(...Object.values(globalReducers))

  return reducer$
}

export const createReducer = <S extends any>(
  ...streams: Observable<Reducer<S>>[]
): Observable<Reducer<S>> => {
  return merge(...streams)
}
