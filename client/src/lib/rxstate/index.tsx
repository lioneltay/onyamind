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

export function createObservableStateTools<S>(
  reducer$: Observable<Reducer<S>>,
  initial_state: S,
) {
  const Context = createContext((null as unknown) as S)
  const reducer_stream = reducer$.pipe(shareReplay(1))
  let current_state = initial_state

  type WrappedDispatcherMap<A> = { [K in keyof A]: ConnectedDispatcher<A[K]> }
  type DispatcherMap = { [key: string]: Dispatcher<any> }

  function connect<A extends DispatcherMap, R extends any>(
    selector: Selector<S, R> | null,
    _actions: A,
  ) {
    const actions = Object.keys(_actions).reduce(
      (acc: any, key) => {
        acc[key] = (...args: any[]) => {
          const dispatcher = _actions[key]
          const val = dispatcher(...args)

          const payload = typeof val === "function" ? val(current_state) : val
          dispatcher.output_s.next(payload)
          return payload
        }

        return acc
      },
      {} as WrappedDispatcherMap<A>,
    )

    if (!selector) {
      return <P extends any>(WrappedComponent: React.ComponentType<P>) => {
        type NewProps = Omit<P, keyof R | keyof A>

        const Connect = forwardRef<typeof WrappedComponent, NewProps>(
          (props, ref) => {
            const Comp = WrappedComponent as React.ComponentType<any>
            return <Comp ref={ref} {...props} {...actions} />
          },
        )

        return Connect
      }
    }

    return <P extends any>(WrappedComponent: React.ComponentType<P>) => {
      type NewProps = Omit<P, keyof R | keyof A>

      const Connect = forwardRef<typeof WrappedComponent, NewProps>(
        (props, ref) => {
          const context = useContext(Context)

          const state_ref = useRef((null as unknown) as R)
          const new_state = selector(context)

          const child_ref = useRef((null as unknown) as React.ReactElement<
            NewProps
          >)

          if (shallowEquals(new_state, state_ref.current)) {
            return child_ref.current
          }

          state_ref.current = new_state

          const Comp = WrappedComponent as React.ComponentType<any>
          child_ref.current = (
            <Comp ref={ref} {...new_state} {...props} {...actions} />
          ) as React.ReactElement<NewProps>

          return child_ref.current
        },
      )

      return Connect
    }
  }

  const Provider: React.FunctionComponent = ({ children }) => {
    const forceUpdate = useForceUpdate()

    useEffect(
      () => {
        const subscription = reducer_stream.subscribe(reducer => {
          current_state = reducer(current_state)
          forceUpdate()
        })
        return () => subscription.unsubscribe()
      },
      [reducer_stream],
    )

    return <Context.Provider value={current_state}>{children}</Context.Provider>
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

export function createReducer<S extends any>(
  _state_subject: Subject<S> | Observable<Reducer<S>>[],
  _streams?: Observable<Reducer<S>>[],
): Observable<Reducer<S>> {
  const state_subject = Array.isArray(_state_subject)
    ? undefined
    : _state_subject
  const streams = (_streams ? _streams : _state_subject) as Observable<
    Reducer<S>
  >[]

  return merge(...streams).pipe(
    map(reducer => (state: S) => {
      const new_state = reducer(state)
      if (state_subject) {
        state_subject.next(new_state)
      }
      return new_state
    }),
  )
}

type ThunkDispatcher<I extends any[] = any, R = any, S = any> = (
  ...input: I
) => (state: S) => R

export type ConnectedDispatcher<D> = D extends ThunkDispatcher
  ? UnwrapThunkDispatcher<D>
  : D

type UnwrapThunkDispatcher<AC extends FunctionType> = (
  ...args: Arguments<AC>
) => ReturnType<ReturnType<AC>>

interface VoidDispatcher {
  (): void
  pipe: Observable<void>["pipe"]
  output_s: Subject<void>
}

interface Dispatcher<AC extends FunctionType> {
  (...args: Arguments<AC>): ReturnType<AC>
  pipe: Observable<
    ReturnType<AC> extends FunctionType
      ? ReturnType<ReturnType<AC>>
      : ReturnType<AC>
  >["pipe"]
  output_s: Subject<
    ReturnType<AC> extends FunctionType
      ? ReturnType<ReturnType<AC>>
      : ReturnType<AC>
  >
}

export function createDispatcher(): VoidDispatcher
export function createDispatcher<AC extends FunctionType>(
  creator: AC,
): Dispatcher<AC>
export function createDispatcher<AC extends FunctionType>(
  _creator?: AC,
): VoidDispatcher | Dispatcher<AC> {
  const output_s = new Subject<ReturnType<AC>>()
  const creator: any = _creator || (() => {})

  const dispatcher: Dispatcher<AC> = (...input: Arguments<AC>) => {
    return creator(...input)
  }

  dispatcher.output_s = output_s as any
  dispatcher.pipe = (...args: any[]) => (output_s.pipe as any)(...args)

  return dispatcher
}
