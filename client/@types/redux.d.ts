// import { ActionCreator } from "redux"

// declare module "redux" {
//   /**
//    * This allows correct bind action creators to correctly type action creators that return thunk actions.
//    * Review this again in the future.
//    * This pattern can be repeated for other types of middleware in the future.
//    */
//   type ThunkActionCreator<T extends Array<any>, R = any> = (
//     ...args: T
//   ) => (dispatch: Dispatch, getState: () => any) => R

//   type AsyncActionCreatorMapObject = Record<
//     string,
//     ThunkActionCreator<any> | ActionCreator<any>
//   >

//   // It looks like if you write a custom overload it takes priority over the existing overloads
//   export function bindActionCreators<T extends AsyncActionCreatorMapObject>(
//     actions: T,
//     dispatch: Dispatch,
//   ): {
//     [K in keyof T]: T[K] extends ThunkActionCreator<infer A, infer B>
//       ? (...args: A) => B
//       : // Could add more cases here for different types of action creators
//         T[K]
//   }

//   /**
//    * This alows dispatch to handle thunk actions, useful when manually dispatching.
//    * Example: the redux SSR implementation which manually dispatched a getViewer thunk action creator.
//    */
//   type ThunkAction<R> = (dispatch: Dispatch, getState: any) => R

//   export interface Dispatch {
//     <R>(input: ThunkAction<R>): R
//   }

//   export type BoundThunk<T extends (...args: any[]) => any> = (
//     ...args: Arguments<T>
//   ) => ReturnType<ReturnType<T>>
// }

// // type WrappedThunk<
// //   T extends ThunkActionCreator<any, any>
// // > = T extends ThunkActionCreator<infer A, infer B> ? (...args: A) => B : never

// // function applyIt<T extends ThunkActionCreator<any, any>>(
// //   dispatch: Dispatch,
// //   thunkActionCreator: T
// // ): T extends ThunkActionCreator<infer A, infer B> ? (...args: A) => B : never {
// //   return ((...args: any[]) => dispatch(thunkActionCreator(...args))) as any
// // }
