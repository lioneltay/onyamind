import React, { useState, Fragment } from "react"
import { Subject, merge, from, Observable } from "rxjs"
import { map, concatMap } from "rxjs/operators"
import { create, combineReducers, createReducer } from "lib/rxstate"

const wait = (ms: number) => {
  return new Promise(res => setTimeout(res, ms))
}

type CounterState = number
const inc$ = new Subject<void>()
const dec$ = new Subject<void>()
const reset$ = new Subject<void>()
const delayedReset$ = new Subject<void>()
const add$ = new Subject<number>()

const counterReducer$ = createReducer<CounterState>(
  add$.pipe(map(val => (state: CounterState) => state + val)),
  inc$.pipe(map(() => (state: CounterState) => state + 1)),
  dec$.pipe(map(() => (state: CounterState) => state - 1)),
  reset$.pipe(map(() => () => 10)),
  delayedReset$.pipe(
    concatMap(() => {
      return from(wait(3000).then(() => (): number => 10))
    }),
  ),
)

type ItemsState = string[]
const append$ = new Subject<string>()
const itemsReducer$ = append$.pipe(
  map(item => (state: ItemsState) => state.concat(item)),
)

type AppAState = {
  counter: CounterState
  items: ItemsState
}
const appAReducer$ = combineReducers({
  counter: counterReducer$,
  items: itemsReducer$,
})

type TotalState = {
  appA: AppAState
}

const rootReducer$ = combineReducers({
  appA: appAReducer$,
})

const initial_state: TotalState = {
  appA: {
    counter: 10,
    items: ["first"],
  },
}

const { reducer_stream, connect, Provider } = create(
  rootReducer$,
  initial_state,
)

type CounterProps = {
  increment: () => void
  decrement: () => void
  reset: () => void
  delayedReset: () => void
  counter: number
}

const Counter: React.FunctionComponent<CounterProps> = ({
  increment,
  decrement,
  counter,
  reset,
  delayedReset,
}) => {
  console.log("Counter Render")

  return (
    <div>
      <div>
        <button onClick={increment}>Increment</button>
      </div>
      <div>
        <button onClick={decrement}>Decrement</button>
      </div>
      <div>
        <button onClick={reset}>Reset</button>
      </div>
      <div>
        <button onClick={delayedReset}>Delayed Reset</button>
      </div>
      <h1>{counter}</h1>
    </div>
  )
}

const ConnectedCounter = connect(
  state => {
    return { counter: state.appA.counter }
  },
  {
    increment: inc$,
    decrement: dec$,
    reset: reset$,
    delayedReset: delayedReset$,
  },
)(Counter)

type ItemsProps = {
  items: string[]
  addItem: (item: string) => void
}

const Items: React.FunctionComponent<ItemsProps> = ({ items, addItem }) => {
  console.log("Items Render")

  return (
    <div>
      <button onClick={() => addItem(Math.random().toString())}>Add</button>

      {items.map(item => (
        <div>{item}</div>
      ))}
    </div>
  )
}

const ConnectedItems = connect(
  state => ({ items: state.appA.items }),
  { addItem: append$ },
)(Items)

const SandboxPage: React.FunctionComponent = () => {
  const [show, setShow] = useState(true)

  console.log("Page Render")

  return (
    <Provider>
      <div>
        <h1>Sandbox Nice!</h1>
        <button onClick={() => setShow(show => !show)}>Show</button>

        {show && (
          <Fragment>
            <ConnectedCounter ref={el => el} />

            <hr />

            <ConnectedCounter />

            <hr />

            <ConnectedItems />
          </Fragment>
        )}
      </div>
    </Provider>
  )
}

export default SandboxPage
