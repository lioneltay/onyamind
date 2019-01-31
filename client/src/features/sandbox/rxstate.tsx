import React, { useState, Fragment } from "react"
import { Subject, merge, from, Observable, interval, ReplaySubject } from "rxjs"
import {
  map,
  delay,
  concatMap,
  shareReplay,
  publishReplay,
  tap,
  switchMap,
  refCount,
  takeUntil,
  multicast,
} from "rxjs/operators"
import {
  createObservableStateTools,
  combineReducers,
  createReducer,
  ConnectedDispatcher,
} from "lib/rxstate"

export default () => null

// const wait = (ms: number): Promise<void> => {
//   return new Promise(res => setTimeout(res, ms))
// }

// const { connect, Provider, createDispatcher } = createObservableStateTools<
//   TotalState
// >()

// type CounterState = { count: number }
// const inc = createDispatcher()
// const dec = createDispatcher()

// const counterReducer$ = createReducer<CounterState>(
//   inc.pipe(
//     map(() => (state: CounterState) => ({ ...state, count: state.count + 1 })),
//   ),
//   dec.pipe(
//     map(() => (state: CounterState) => ({ ...state, count: state.count - 1 })),
//   ),
// )

// type FormState = {
//   value: number
// }

// const getValue = createDispatcher(() => {
//   return (state: TotalState) => {
//     return wait(2000).then(() => state.counter_app.count)
//   }
// })

// const formReducer$ = createReducer<FormState>()
// // getValue.pipe(
// //   switchMap(val => from(val).pipe(takeUntil(counterState$))),
// //   map(count => (state: FormState) => ({ ...state, value: count })),
// // ),

// type TotalState = {
//   counter_app: CounterState
//   form_app: FormState
// }

// const initial_state: TotalState = {
//   counter_app: {
//     count: 0,
//   },
//   form_app: {
//     value: 0,
//   },
// }

// const rootReducer$ = combineReducers({
//   counter_app: counterReducer$,
//   form_app: formReducer$,
// })

// type CounterProps = {
//   increment: () => void
//   decrement: () => void
//   count: number
// }

// const Counter: React.FunctionComponent<CounterProps> = ({
//   increment,
//   decrement,
//   count,
// }) => {
//   return (
//     <div>
//       <div>
//         <button onClick={increment}>Increment</button>
//       </div>
//       <div>
//         <button onClick={decrement}>Decrement</button>
//       </div>
//       <h1>{count}</h1>
//     </div>
//   )
// }

// const ConnectedCounter = connect(
//   state => ({ count: state.counter_app.count }),
//   {
//     increment: inc,
//     decrement: dec,
//   },
// )(Counter)

// type FormProps = {
//   value: number
//   getValue: ConnectedDispatcher<typeof getValue>
// }

// const Form: React.FunctionComponent<FormProps> = ({ value, getValue }) => {
//   const [submitting, setSubmitting] = useState(false)

//   return (
//     <div>
//       <h1>{value}</h1>
//       <button
//         disabled={submitting}
//         onClick={async () => {
//           setSubmitting(true)
//           getValue().then(() => setSubmitting(false))
//         }}
//       >
//         Submit
//       </button>
//       <div>{submitting ? "SUBMITTING" : "IDLE"}</div>
//     </div>
//   )
// }

// const ConnectedForm = connect(
//   state => ({ value: state.form_app.value }),
//   {
//     getValue,
//   },
// )(Form)

// const SandboxPage: React.FunctionComponent = () => {
//   const [show, setShow] = useState(true)

//   return (
//     <Provider initialState={initial_state} reducerStream={rootReducer$}>
//       <div>
//         <h1>Sandbox Nice!</h1>
//         <button onClick={() => setShow(show => !show)}>Show</button>

//         {show && (
//           <Fragment>
//             <ConnectedCounter />

//             <hr />

//             <ConnectedForm />
//           </Fragment>
//         )}
//       </div>
//     </Provider>
//   )
// }

// export default SandboxPage

// // const stream = interval(1000).pipe(
// //   tap(val => console.log("Tap: ", val)),
// //   // shareReplay(1),
// //   publishReplay(1),
// //   // multicast(() => new ReplaySubject(1)),
// //   refCount(),
// // )

// // let subA = stream.subscribe(val => console.log("A: ", val))
// // let subB

// // setTimeout(() => {
// //   subB = stream.subscribe(val => console.log("B: ", val))
// // }, 4500)

// // setTimeout(() => {
// //   subA.unsubscribe()
// //   subB.unsubscribe()
// // }, 8000)

// // setTimeout(() => {
// //   stream.subscribe(val => console.log("C: ", val))
// // }, 11000)
