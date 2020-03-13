import { Dispatch, Store } from "redux"

type Action<T extends string> = {
  type: T
}

type ActionWithPayload<T extends string, P> = Action<T> & {
  payload: P
}

export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(
  type: T,
  payload: P,
): ActionWithPayload<T, P>
export function createAction<T extends string, P>(type: T, payload?: P) {
  return payload === undefined ? { type } : { type, payload }
}

type FunctionType = (...args: any[]) => any

type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType }

type FilterAction<T> = T extends Action<any> ? T : never

export type ActionsUnion<A extends ActionCreatorsMapObject> = FilterAction<
  ReturnType<A[keyof A]>
>

type ActionTypesHelper<T> = T extends Action<any> ? T["type"] : never

export type ActionTypesUnion<
  A extends ActionCreatorsMapObject
> = ActionTypesHelper<ActionsUnion<A>>

interface AsyncActionInput<A extends any[], R> {
  apiCall: (...args: A) => Promise<R>
  pending: () => any
  failure: () => any
  success: (input: R) => any
}

export function asyncAction<A extends Array<any>, R>({
  apiCall,
  pending,
  failure,
  success,
}: AsyncActionInput<A, R>) {
  return (...args: A) => (dispatch: Dispatch) => {
    dispatch(pending())
    return apiCall(...args)
      .then(res => {
        dispatch(success(res))
        return res
      })
      .catch(e => {
        dispatch(failure())
        throw e
      })
  }
}
