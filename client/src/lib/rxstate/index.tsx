import React, {
  memo,
  useEffect,
  useContext,
  createContext,
  useRef,
  forwardRef,
} from "react"
import { Observable, merge, Subject } from "rxjs"
import { map } from "rxjs/operators"
import shallowEquals from "shallowequal"

import { useForceUpdate } from "./utils"

export type Reducer<S> = (state: S) => S
type Selector<S, R> = (state: S) => R

export function createObservableStateTools<S>() {
  let provider_mounted = false

  const Context = createContext((null as unknown) as S)
  let current_state: S
  let state_s = new Subject<S>()

  function createDispatcher(): VoidDispatcher
  function createDispatcher<AC extends FunctionType>(
    dispatcher: AC,
  ): Dispatcher<AC>
  function createDispatcher<AC extends FunctionType>(
    _dispatcher?: AC,
  ): Dispatcher<AC> {
    const output_s = new Subject<ReturnType<AC>>()
    const dispatcher: any = _dispatcher || (() => {})

    const wrappedDispatcher: Dispatcher<AC> = (...input: Arguments<AC>) => {
      const val = dispatcher(...input)

      const payload = typeof val === "function" ? val(current_state) : val
      output_s.next(payload)
      return payload
    }

    wrappedDispatcher.output_s = output_s as any
    wrappedDispatcher.pipe = (...args: any[]) => (output_s.pipe as any)(...args)

    return wrappedDispatcher
  }

  type WrappedDispatcherMap<A> = { [K in keyof A]: ConnectedDispatcher<A[K]> }
  type DispatcherMap = { [key: string]: Dispatcher<any> }

  function connect<A extends DispatcherMap, R extends any>(
    _selector: Selector<S, R> | null,
    dispatchers: A,
  ) {
    const selector = _selector || (() => ({} as R))

    return <P extends any>(WrappedComponent: React.ComponentType<P>) => {
      type NewProps = Omit<P, keyof R | keyof A>
      const Comp = memo(WrappedComponent) as React.ComponentType<any>

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

          child_ref.current = (
            <Comp ref={ref} {...new_state} {...props} {...dispatchers} />
          ) as React.ReactElement<NewProps>

          return child_ref.current
        },
      )

      return Connect
    }
  }

  type ProviderProps = {
    reducerStream: Observable<Reducer<S>>
    initialState: S
  }

  const Provider: React.FunctionComponent<ProviderProps> = ({
    children,
    reducerStream,
    initialState,
  }) => {
    const forceUpdate = useForceUpdate()

    if (!provider_mounted) {
      current_state = initialState
    }

    useEffect(() => {
      if (provider_mounted) {
        throw Error("Provider is already mounted")
      }
      provider_mounted = true

      return () => {
        provider_mounted = false
      }
    }, [])

    useEffect(
      () => {
        const subscription = reducerStream.subscribe(reducer => {
          current_state = reducer(current_state)
          state_s.next(current_state)
          forceUpdate()
        })
        return () => subscription.unsubscribe()
      },
      [reducerStream],
    )

    return <Context.Provider value={current_state}>{children}</Context.Provider>
  }

  return {
    connect,
    Provider,
    createDispatcher,
    state_s,
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
  ...streams: Observable<Reducer<S>>[]
): Observable<Reducer<S>> {
  return merge(...streams)
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

type DispatcherReturnType<AC extends FunctionType> = ReturnType<
  AC
> extends FunctionType
  ? ReturnType<ReturnType<AC>>
  : ReturnType<AC>

interface Dispatcher<AC extends FunctionType> {
  (...args: Arguments<AC>): DispatcherReturnType<AC>
  pipe: Observable<DispatcherReturnType<AC>>["pipe"]
  output_s: Subject<DispatcherReturnType<AC>>
}
