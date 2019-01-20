// import { Observable, of, pipe, Subject, OperatorFunction } from "rxjs"
// import {
//   merge,
//   scan,
//   publishReplay,
//   refCount,
//   map,
//   startWith,
// } from "rxjs/operators"

// type State = {
//   counter: number
// }

// type Reducer = [keyof State, (state: State) => State]

// const createState = (reducer$: Observable<Reducer>, initialState: State) => {
//   return reducer$.pipe(
//     scan(
//       (state, [scope, reducer]) => ({
//         ...state,
//         [scope]: reducer(state[scope]),
//       }),
//       initialState,
//     ),
//   )
// }

// const add$ = new Subject()
// const counterReducer$ = add$.pipe(map(payload => state => state + payload))
// const rootReducer$ = counterReducer$.pipe(map(counter => ["counter", counter]))
// const state$ = createState(rootReducer$, { counter: 10 })

// add$.next(1)

// state$.subscribe(v => {
//   console.log("gogo", v)
// })

// add$.next(2)

// add$.next(5)

// add$.next(-2)

// add$.next(-5)