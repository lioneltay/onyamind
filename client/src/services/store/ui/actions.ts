import { bindActionCreators, Dispatch } from "redux"
import { useDispatch } from "react-redux"
import { ActionsUnion, ActionTypesUnion } from "services/store/helpers"
import { State } from "services/store/listPage/reducer"
import * as selectors from "services/store/listPage/selectors"
import * as api from "services/api"

type GetState = () => State

const Action = {}

export const actionCreators = {}

export type Action = ActionsUnion<typeof Action>
export type ActionType = ActionTypesUnion<typeof Action>

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actionCreators, dispatch)
}
