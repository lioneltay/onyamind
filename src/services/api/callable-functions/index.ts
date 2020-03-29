import { firebase } from "services/firebase"

type CallableFunction<Data, Result = void> = (data: Data) => Promise<Result>

function callableFunction<D, R = void>(name: string): CallableFunction<D, R> {
  return (firebase
    .functions()
    .httpsCallable(name) as unknown) as CallableFunction<D, R>
}

type SendFeedbackInput = {
  subject: string
  description?: string
}
export const sendFeedback = callableFunction<SendFeedbackInput>("sendFeedback")
